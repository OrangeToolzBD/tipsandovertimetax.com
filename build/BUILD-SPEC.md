# 01 · Tips & Overtime Tax — build spec

**Calculators for the federal no-tax-on-tips and no-tax-on-overtime deductions (tax years 2025–2028).**

| | |
|---|---|
| Verdict | **GREEN** — young sites proven in the top 5 on real demand |
| Build wave | Wave 1 — GREEN: launch first (weeks 1–2) |
| Deadline | Live by 1 November 2026 — search demand peaks in the January–April 2027 filing season and the pages need time to be indexed. |
| Market | US (en-US) |
| Measured demand | 156,170 searches/month (close variants counted once) |
| FAST SERPs | 3 of 25 read (19,980/mo) — no tax on overtime calculator (18,100) · no tax on tips calculator (1,000) · how to calculate no tax on overtime (880) |
| Proof young sites rank | notaxovertimecalculator.com (8mo), digitalcalculator.info (9mo), notaxonovertimecalculator.com (14mo) |
| Head-term seasonality | peak Jan 2026; latest month is 9% of peak |

## 1. Domain

**Use: `tipsandovertimetax.com`** — Likely available

| Alternative | Status (registry check 2026-09-14) |
|---|---|
| `notaxontipscalc.com` | Likely available |
| `overtimetaxsaver.com` | Likely available |
| `tipdeductioncalculator.com` | Likely available |
| `overtimededuction.net` | Likely available |

Availability was a registry pre-check only. **Nothing has been registered.** Confirm at the registrar (premium/reserved names do not show in RDAP) and get approval before buying. See `03-DOMAINS.md`.

## 2. What is already built — and what you do

`site/` is a complete static site that already works: open any tool page and the calculator runs. What is missing is the **writing** and the **verification**.

| Done for you | You do |
|---|---|
| 6 pages + home, about, contact, privacy, terms, 404 | Write every `WRITE:` block (brief below) |
| 2 working calculator(s) with 9 test cases | Resolve every `VERIFY_BEFORE_LAUNCH` item (section 5) and update tests |
| Titles, meta descriptions, H1s, canonicals, schema, sitemap, robots | Replace `REPLACE_` tokens (author, launch date, contact email, GA4 ID) |
| Breadcrumbs, internal links, disclaimers | Run `node tools/check-site.mjs 01` until it prints READY TO LAUNCH |

## 3. Pages

| URL | Type | Primary keyword | Vol/mo | SERP | Page demand/mo | Words |
|---|---|---|---|---|---|---|
| `/no-tax-on-overtime-calculator/` | tool | no tax on overtime calculator | 18,100 | FAST | 103,060 | 1200 |
| `/no-tax-on-tips-calculator/` | tool | no tax on tips calculator | 1,000 | FAST | 28,520 | 1200 |
| `/how-no-tax-on-overtime-works/` | guide | how does no tax on overtime work | 8,100 | OPENING | 15,390 | 1600 |
| `/how-no-tax-on-tips-works/` | guide | how does no tax on tips work | 1,900 | OPENING | 4,960 | 1600 |
| `/no-tax-on-tips-2025/` | dated | no tax on tips 2025 | 2,900 | LOCKED | 2,900 | 900 |
| `/no-tax-on-tips-2026/` | dated | no tax on tips 2026 | 720 | LOCKED | 750 | 900 |

SERP: **FAST** = a domain ≤24 months old already ranks top 5 · **OPENING** = weak results in the top 10 · **LOCKED** = established sites only (still covered, don’t expect fast rankings) · **NOT READ** = SERP not checked.

**Build order:** tool pages first, in the order above; then dated pages; then guides and comparisons. Publish tool pages together on day 1, then 2–3 content pages per week.

## 4. Page briefs

### `/no-tax-on-overtime-calculator/` — No Tax on Overtime Calculator

| | |
|---|---|
| Title (51 chars) | No Tax on Overtime Calculator (2025–2028 Deduction) |
| Meta description (141 chars) | Estimate your federal overtime deduction and tax saved in 30 seconds. Uses the IRS caps ($12,500 single, $25,000 joint) and income phase-out. |
| H1 | No Tax on Overtime Calculator |
| Primary keyword | **no tax on overtime calculator** — use in the title, H1, first paragraph and one H2. No keyword stuffing. |
| Type · length | tool · calculator `overtime` · ~1200 words |

**Secondary keywords** — work in naturally, one per section at most:

| Keyword | Vol/mo | SERP | Young domains ranking |
|---|---|---|---|
| no tax on overtime | 60,500 | LOCKED | — |
| overtime tax deduction | 12,100 | LOCKED | — |
| no tax on overtime bill | 2,900 | LOCKED | — |
| does overtime get taxed | 2,400 | OPENING | — |
| is no tax on overtime in effect | 1,900 | LOCKED | — |
| overtime tax deduction calculator | 1,000 | OPENING | #8 digitalcalculator.info (9mo) |
| is overtime taxable | 880 | LOCKED | — |
| no tax on overtime start date | 720 | OPENING | — |
| no tax on overtime passed | 480 | NOT READ | — |
| no tax on overtime law | 390 | NOT READ | — |
| no tax on overtime reddit | 320 | NOT READ | — |
| no tax on overtime w2 | 260 | NOT READ | — |
| no tax on overtime details | 210 | NOT READ | — |
| tips tax credit | 170 | NOT READ | — |
| no tax on overtime irs | 170 | NOT READ | — |

**Outline** (H2s already in the page):

1. How the overtime deduction works (only the premium half of time-and-a-half)
2. Worked example: $25/hour, 300 overtime hours
3. Caps and income phase-out
4. What it does not reduce (Social Security, Medicare, state tax)
5. How to claim it on your return

**FAQ — questions Google shows for these searches** (already in the page as FAQ items; answer each in 40–80 words):

- How does the no tax on overtime work?
- How will the no tax on overtime work in 2026?
- How soon will no tax on overtime start?
- How much will no tax on overtime save me?
- How to calculate your no tax overtime?
- How much more money will I get with no tax on overtime?
- How will the no tax on OT work?
- Do you get a bigger tax refund if you work overtime?


### `/no-tax-on-tips-calculator/` — No Tax on Tips Calculator

| | |
|---|---|
| Title (51 chars) | No Tax on Tips Calculator — Estimate Your Deduction |
| Meta description (141 chars) | See how much of your tips you can deduct (up to $25,000) and the federal tax you save. W-2 and self-employed tips, income phase-out included. |
| H1 | No Tax on Tips Calculator |
| Primary keyword | **no tax on tips calculator** — use in the title, H1, first paragraph and one H2. No keyword stuffing. |
| Type · length | tool · calculator `tips` · ~1200 words |

**Secondary keywords** — work in naturally, one per section at most:

| Keyword | Vol/mo | SERP | Young domains ranking |
|---|---|---|---|
| no tax on tips | 27,100 | LOCKED | — |
| tips tax deduction | 390 | NOT READ | — |
| tips tax deduction 2025 | 30 | NOT READ | — |

**Outline** (H2s already in the page):

1. Who can deduct tips (tipped occupations list)
2. Worked example: server with $12,000 in tips
3. W-2 tips vs self-employed tips
4. Income phase-out
5. Records to keep

**FAQ — questions Google shows for these searches** (already in the page as FAQ items; answer each in 40–80 words):

- How will the no tax on tips work?
- What's the downside to no tax on tips?
- Has no tax on tips kicked in yet?
- Which states are allowing no tax on tips?
- How do I calculate my no tax on tips?
- How much will no tax on tips save me?
- How does the new no tax on tips work?
- Does everyone get a $3,000 tax refund?


### `/how-no-tax-on-overtime-works/` — How No Tax on Overtime Works

| | |
|---|---|
| Title (57 chars) | How Does No Tax on Overtime Work? Rules, Limits, Examples |
| Meta description (139 chars) | Plain-English guide to the overtime deduction: what counts as qualified overtime, the $12,500 cap, the income limit, and 3 worked examples. |
| H1 | How No Tax on Overtime Works |
| Primary keyword | **how does no tax on overtime work** — use in the title, H1, first paragraph and one H2. No keyword stuffing. |
| Type · length | guide · ~1600 words |

**Secondary keywords** — work in naturally, one per section at most:

| Keyword | Vol/mo | SERP | Young domains ranking |
|---|---|---|---|
| no tax on overtime explained | 5,400 | OPENING | — |
| no tax on overtime income limit | 1,300 | LOCKED | — |
| no tax on overtime 2026 | 590 | NOT READ | — |

**Outline** (H2s already in the page):

1. Qualified overtime: FLSA overtime premium only
2. Income limit and phase-out
3. Three examples (hourly nurse, warehouse worker, married couple)
4. Tax years it applies to (2025–2028)
5. Common mistakes

**FAQ — questions Google shows for these searches** (already in the page as FAQ items; answer each in 40–80 words):

- How much money will I get back for no tax on overtime?
- Will my tax return be bigger with no tax on overtime?
- Is no tax on overtime a good thing?
- How much of overtime pay will not be taxed?
- What is the downside of no tax on overtime?
- Will I get a bigger tax refund if I work overtime?
- How will the no tax on overtime work in 2026?
- Who qualifies for the no tax on overtime?


### `/how-no-tax-on-tips-works/` — How No Tax on Tips Works

| | |
|---|---|
| Title (50 chars) | How Does No Tax on Tips Work? Rules & Income Limit |
| Meta description (146 chars) | Who qualifies, which tips count, the $25,000 cap and the income limit — with examples for servers, bartenders, hair stylists and delivery drivers. |
| H1 | How No Tax on Tips Works |
| Primary keyword | **how does no tax on tips work** — use in the title, H1, first paragraph and one H2. No keyword stuffing. |
| Type · length | guide · ~1600 words |

**Secondary keywords** — work in naturally, one per section at most:

| Keyword | Vol/mo | SERP | Young domains ranking |
|---|---|---|---|
| no tax on tips rules | 1,600 | LOCKED | — |
| no tax on tips explained | 880 | NOT READ | — |
| what is no tax on tips | 210 | NOT READ | — |
| no tax on tips income limit | 140 | NOT READ | — |
| no tax on tips how does it work | 110 | NOT READ | — |
| no tax on tips eligibility | 70 | NOT READ | — |
| no tax on tips example | 50 | NOT READ | — |

**Outline** (H2s already in the page):

1. Which jobs qualify
2. Which tips count (voluntary, reported)
3. Cap and income limit
4. Examples by job
5. Self-employed and gig workers

**FAQ — questions Google shows for these searches** (already in the page as FAQ items; answer each in 40–80 words):

- How does the No Tax on Tips work?
- How is the No Tax on Tips going to work exactly now?
- What is the $600 rule?
- What's the downside to No Tax on Tips?
- How much will I get back no tax on tips?
- Who will benefit from no tax on tips?
- How does the no tax on tips and overtime work?
- How is the no tax on tips going to work exactly now?


### `/no-tax-on-tips-2025/` — No Tax on Tips for 2025 Returns

| | |
|---|---|
| Title (52 chars) | No Tax on Tips 2025: Claiming It on Your 2025 Return |
| Meta description (139 chars) | What the tips deduction means for the 2025 tax year: how to claim it, what your employer reports, and how to fix a return filed without it. |
| H1 | No Tax on Tips for 2025 Returns |
| Primary keyword | **no tax on tips 2025** — use in the title, H1, first paragraph and one H2. No keyword stuffing. |
| Type · length | dated · ~900 words |

**Outline** (H2s already in the page):

1. What changed for 2025
2. How 2025 tips were reported
3. Already filed? Amending a 2025 return
4. Use the calculator

**FAQ — questions Google shows for these searches** (already in the page as FAQ items; answer each in 40–80 words):

- How does the No Tax on Tips work?
- Are servers still getting taxed on tips?
- How is the No Tax on Tips going to work exactly now?
- Who gets the new $6000 tax break?


### `/no-tax-on-tips-2026/` — No Tax on Tips in 2026

| | |
|---|---|
| Title (46 chars) | No Tax on Tips 2026: Limits and What to Expect |
| Meta description (131 chars) | The tips deduction for tax year 2026: the cap, the income limit, reporting on your W-2, and when you claim it (filing season 2027). |
| H1 | No Tax on Tips in 2026 |
| Primary keyword | **no tax on tips 2026** — use in the title, H1, first paragraph and one H2. No keyword stuffing. |
| Type · length | dated · ~900 words |

**Secondary keywords** — work in naturally, one per section at most:

| Keyword | Vol/mo | SERP | Young domains ranking |
|---|---|---|---|
| no tax on tips 2026 explained | 20 | NOT READ | — |
| no tax on tips for 2026 | 10 | NOT READ | — |

**Outline** (H2s already in the page):

1. 2026 limits
2. W-2 and 1099 reporting
3. Filing in 2027
4. Use the calculator

**FAQ — questions Google shows for these searches** (already in the page as FAQ items; answer each in 40–80 words):

- How will no tax on tips work?
- Is no tax on tips passed yet?
- Who gets the new $6000 tax break?
- Which states are allowing no tax on tips?


## 5. Calculators

File: `site/assets/calculator.js` (one per site). Shared engine: `site/assets/calc-core.js` — do not fork it per site; fix bugs in `template/assets/calc-core.js` and copy to all sites.

```text
calculator.js — tipsandovertimetax.com
Two tools: "overtime" and "tips". Federal income-tax deductions under the 2025 reconciliation act (tax years 2025–2028).

FIGURE STATUS (see README → Figures & verification):
  VERIFIED on irs.gov 2026-09-14: tips cap $25,000 · overtime cap $12,500 ($25,000 joint) ·
    phase-out starts above MAGI $150,000 ($300,000 joint) · SSN required · married must file jointly.
  VERIFY_BEFORE_LAUNCH: the phase-out RATE ($100 per $1,000 of MAGI over the threshold) and whether the
    reduction is per full $1,000 or proportional. Not found on irs.gov pages checked; congress.gov blocked.
    Check the Schedule 1-A instructions (irs.gov/forms-pubs) and set PHASEOUT below, then delete this note.
```

### `overtime` — No tax on overtime calculator

Used on: `/no-tax-on-overtime-calculator/`

| Input | Type | Default |
|---|---|---|
| How do you want to enter overtime? | radio | hours |
| Regular hourly rate | number (conditional) | 25 |
| Overtime hours worked in the year (over 40/week) | number (conditional) | 300 |
| Overtime premium paid (the "half" in time-and-a-half) | number (conditional) | 3750 |
| Filing status | select | single |
| Modified adjusted gross income (MAGI) | number | 65000 |
| Your federal tax bracket | select | 22 |
| I have a valid Social Security number (and so does my spouse, if filing jointly) | checkbox | true |

### `tips` — No tax on tips calculator

Used on: `/no-tax-on-tips-calculator/`

| Input | Type | Default |
|---|---|---|
| Qualified tips reported on your W-2 | number | 12000 |
| Qualified tips from self-employment (1099) | number | 0 |
| Net profit from that self-employed work | number (conditional) | 0 |
| My job is on the IRS list of occupations that customarily receive tips | checkbox | true |
| Filing status | select | single |
| Modified adjusted gross income (MAGI) | number | 65000 |
| Your federal tax bracket | select | 22 |
| I have a valid Social Security number (and so does my spouse, if filing jointly) | checkbox | true |

**Test cases** (`node tools/run-tests.mjs 01`):

- 300 OT hours at $25 → $3,750 premium, under cap and threshold
- single premium above cap → capped at $12,500
- single MAGI $160,000 → $1,000 reduction (VERIFY rate)
- joint cap $25,000
- married filing separately → $0
- W-2 tips $12,000
- self-employed tips limited to net profit
- tips above $25,000 cap, MAGI $400,000 joint → $10,000 reduction (VERIFY rate)
- no SSN → $0

If you change a figure after verifying it, recompute the affected expected values **by hand from the official source** and update `__tests` — never copy the calculator’s own output into a test.

## 6. Compliance for this site

- YMYL (tax). Every page: "Estimates only — not tax advice. Check with the IRS or a tax professional."
- Every rule stated in content must link to the IRS page it comes from. Do not quote numbers from other calculator sites.
- The phase-out rate is VERIFY_BEFORE_LAUNCH — see calculator.js header. The calculator must not go live with that marker unresolved.
- Author box: a named person with a relevant background (EA/CPA reviewer ideal). No fake credentials.

## 7. Sources

| Source | URL | Status |
|---|---|---|
| IRS — deductions for working Americans and seniors | https://www.irs.gov/newsroom/one-big-beautiful-bill-act-tax-deductions-for-working-americans-and-seniors | VERIFIED 2026-09-14: caps, thresholds, SSN, joint filing |
| IRS — Schedule 1-A and instructions | https://www.irs.gov/forms-pubs | VERIFY_BEFORE_LAUNCH: phase-out rate and rounding |

## 8. Launch checklist for this site

- [ ] Domain approved and registered; DNS pointed; HTTPS working
- [ ] Every `VERIFY_BEFORE_LAUNCH` resolved with the official source open; `checked` dates set; tests updated and passing
- [ ] Every `WRITE:` block written (original — no text reused from another fleet site)
- [ ] `REPLACE_` tokens replaced
- [ ] `node tools/check-site.mjs 01` prints READY TO LAUNCH
- [ ] Calculator checked by hand on a phone (375px) and desktop; print view checked
- [ ] Deployed; Google Search Console + Bing Webmaster verified; sitemap submitted; tool pages submitted for indexing
- [ ] Research files in `research/` kept for later re-measurement
