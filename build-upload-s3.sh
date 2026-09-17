#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# build-upload-s3.sh — BUILD the site and publish it into a directory (prefix) of
# an R2 bucket using R2's S3-COMPATIBLE API (no wrangler). The prefix is made to
# EXACTLY MATCH the new build:
#   • changed files  → overwritten
#   • new files      → added
#   • removed files  → deleted (no stale leftovers)
#
# Unlike the wrangler version, the S3 API can LIST objects, so `aws s3 sync
# --delete` handles upload + stale-cleanup natively — no manifest object needed.
#
# Scope — this script ONLY touches R2 objects under the chosen prefix. It does NOT:
#   • deploy/update any Worker   • change routes   • touch DNS   • create/delete buckets
#
# Auth — uses R2 S3 API credentials (NOT wrangler login), read from the environment:
#   R2_ACCESS_KEY_ID=...
#   R2_SECRET_ACCESS_KEY=...
#   CF_ACCOUNT_ID=...           # used to build the S3 endpoint
# Create them at Cloudflare dashboard → R2 → Manage API Tokens → Create API Token
# (Object Read & Write). Callers supply them as follows:
#   • CI        — deploy.yml passes them in from repo vars/secrets, provisioned by
#                 site-deploy.sh from its .env
#   • local     — site-deploy.sh exports them from its .env
#   • standalone— export them yourself (a .deploy.env is no longer read — see below)
#
# Usage:
#   ./build-upload-s3.sh                          # interactive prompts
#   ./build-upload-s3.sh <bucket> <dir>           # prompts only for site URL
#   ./build-upload-s3.sh <bucket> <dir> <siteUrl> # fully non-interactive
#
# Upload-only: set UPLOAD_ONLY=1 to skip the build and publish pre-built content
# that already lives in the repo (UPLOAD_DIR, default the repo root "."):
#   UPLOAD_ONLY=1 ./build-upload-s3.sh <bucket> <dir>
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"
export PATH="$HOME/.bun/bin:$PATH"

BUCKET="${1:-}"
PREFIX="${2:-}"
SITE_ARG="${3:-}"

# UPLOAD_ONLY skips the build entirely and uploads pre-built content that already
# lives in the repo (UPLOAD_DIR, default the repo root "."). Accept "1" (local
# mode) or "true" (CI repo variable); normalize to "1".
case "${UPLOAD_ONLY:-}" in
  1|true|TRUE|True) UPLOAD_ONLY=1 ;;
  *) UPLOAD_ONLY="" ;;
esac

# NOTE: this script deliberately does NOT source a .deploy.env any more.
# It used to, for standalone runs. But `set -a; source .deploy.env` OVERWRITES the
# environment, so a stale .deploy.env committed to a site repo would silently redirect the
# upload to whatever account it named — beating the credentials CI just passed in, with no
# error and no sign in the log. Now that every repo carries its own R2 variables/secrets
# (provisioned by the fleet console), that file is a hazard with no remaining purpose.
# For a standalone run, export the three values yourself.

# ── Inputs ──────────────────────────────────────────────────────────────────
[ -z "$BUCKET" ] && read -rp "R2 bucket name: " BUCKET
[ -z "$PREFIX" ] && read -rp "Directory (prefix) in bucket: " PREFIX
: "${BUCKET:?bucket name required}"
: "${PREFIX:?directory (prefix) required}"
PREFIX="${PREFIX#/}"; PREFIX="${PREFIX%/}"   # strip leading/trailing slashes

DEF_URL="${VITE_SITE_URL:-}"
if [ -n "$SITE_ARG" ]; then
  VITE_SITE_URL="$SITE_ARG"
else
  read -rp "VITE_SITE_URL [${DEF_URL}]: " IN
  VITE_SITE_URL="${IN:-$DEF_URL}"
fi
export VITE_SITE_URL
echo "Baking VITE_SITE_URL=${VITE_SITE_URL:-<unset>}  VITE_INDEXABLE=${VITE_INDEXABLE:-<unset>}"

# ── Preflight: aws CLI + credentials ─────────────────────────────────────────
command -v aws >/dev/null 2>&1 || { echo "✗ aws CLI not found. Install it: brew install awscli"; exit 1; }

: "${CF_ACCOUNT_ID:?CF_ACCOUNT_ID required — repo variable (CI) or .env (local)}"
: "${R2_ACCESS_KEY_ID:?R2_ACCESS_KEY_ID required — repo secret (CI) or .env (local); R2 → Manage API Tokens}"
: "${R2_SECRET_ACCESS_KEY:?R2_SECRET_ACCESS_KEY required — repo secret (CI) or .env (local); R2 → Manage API Tokens}"

# Map R2 S3 credentials into the env the aws CLI expects.
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION=auto
# aws-cli v2.23+ sends CRC32 checksums by default, which R2 may reject — only
# send/validate checksums when the operation actually requires them.
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

ENDPOINT="https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com"
aws() { command aws "$@" --endpoint-url "$ENDPOINT"; }

echo "▶ Target account id: ${CF_ACCOUNT_ID}"
echo "▶ S3 endpoint: ${ENDPOINT}"

# ── Read-only guard: bucket must already exist (we never create it) ──────────
if ! aws s3api head-bucket --bucket "$BUCKET" >/dev/null 2>&1; then
  echo "✗ bucket '$BUCKET' not reachable in account ${CF_ACCOUNT_ID}."
  echo "  • Wrong account? Check the CF_ACCOUNT_ID repo variable (CI) or .env (local)."
  echo "  • Bad credentials? Check the R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY repo"
  echo "    secrets (CI) or .env (local) — they need Object Read & Write."
  echo "  • Stale config? Re-provision the repo: ./site-deploy.sh github <repo-url>"
  echo "  • Missing bucket? Create it in the dashboard (R2 → Create bucket)."
  exit 1
fi

if [ "$UPLOAD_ONLY" = "1" ]; then
# ── Upload-only: skip the build and publish pre-built content as-is ──────────
# The repo already carries the built static site (no source / bun build). We
# upload UPLOAD_DIR (default the repo root ".") straight to R2.
OUT="${UPLOAD_DIR:-.}"; OUT="${OUT%/}"
echo "▶ Upload-only mode: skipping build; publishing '$OUT' as-is"
test -f "$OUT/index.html" || { echo "✗ upload-only: no $OUT/index.html to publish (repo carries no pre-built content — top level: $(ls -A "$OUT" | tr '\n' ' '))"; exit 1; }
HTML=$(find "$OUT" -name '*.html' | wc -l | tr -d ' ')
FILES=$(find "$OUT" -type f | wc -l | tr -d ' ')
echo "▶ Found $HTML HTML pages ($FILES total files) to upload"
else
# ── Disable nitro for the static build (idempotent, reverted on exit) ─────────
# R2 serves the prerendered HTML from dist/client only — the Cloudflare Worker
# nitro builds is never deployed. Worse, the forced `cloudflare-module` preset
# overwrites dist/server/server.js with a worker bundle (index.mjs), so the
# TanStack Start prerender can't load the SSR handler and every page 500s.
# Turning nitro off makes `vite build` emit the static dist/client + server.js
# layout this script uploads. We patch only the working copy and restore it on
# exit, so the repo tree stays clean for the next `git pull`.
for CFG in vite.config.ts vite.config.mts vite.config.js vite.config.mjs; do
  [ -f "$CFG" ] && break || CFG=""
done
if [ -n "$CFG" ]; then
  if grep -qE '\bnitro[[:space:]]*:' "$CFG"; then
    echo "▶ $CFG already configures nitro — leaving as-is"
  elif grep -qE '^[[:space:]]*export default defineConfig[[:space:]]*\([[:space:]]*\{' "$CFG"; then
    cp "$CFG" "$CFG.deploybak"
    trap 'mv -f "$CFG.deploybak" "$CFG" 2>/dev/null || true' EXIT
    awk '!d && /^[[:space:]]*export default defineConfig[[:space:]]*\([[:space:]]*\{/{print; print "  nitro: false,"; d=1; next}{print}' \
      "$CFG.deploybak" > "$CFG"
    echo "▶ Disabled nitro in $CFG for static build (restored on exit)"
  else
    echo "⚠ could not auto-disable nitro in $CFG (unrecognized shape) — building as-is"
  fi
fi

# ── Build ────────────────────────────────────────────────────────────────────
echo "▶ Building…"
rm -rf dist .output
bun run build
OUT=dist/client
test -f "$OUT/index.html" || { echo "✗ build failed (no $OUT/index.html)"; exit 1; }
HTML=$(find "$OUT" -name '*.html' | wc -l | tr -d ' ')
FILES=$(find "$OUT" -type f | wc -l | tr -d ' ')
echo "▶ Built $HTML HTML pages ($FILES total files)"
fi

# ── Confirm ──────────────────────────────────────────────────────────────────
if [ "${CI:-}" = "true" ] || [ "${ASSUME_YES:-}" = "1" ]; then
  ok=y
else
  read -rp "Proceed? [y/N] " ok
fi
[ "$ok" = y ] || [ "$ok" = Y ] || { echo "aborted"; exit 1; }

# ── Sync (uploads new/changed, deletes stale; Content-Type auto-detected) ────
# In upload-only mode OUT is the repo root, so exclude VCS/tooling files that
# must never be published (they're also protected from --delete by the excludes).
echo "▶ Syncing…"
if [ "$UPLOAD_ONLY" = "1" ]; then
  aws s3 sync "$OUT/" "s3://$BUCKET/$PREFIX/" --delete --no-progress \
    --exclude '.git/*' --exclude '.github/*' --exclude 'node_modules/*' \
    --exclude '.deploy.env' --exclude 'build-upload-s3.sh' --exclude '.gitignore'
else
  aws s3 sync "$OUT/" "s3://$BUCKET/$PREFIX/" --delete --no-progress
fi

echo "✓ Published to s3://$BUCKET/$PREFIX/  (prefix now matches the build; no Worker/DNS changed)"
