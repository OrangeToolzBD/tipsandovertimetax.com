/* ui.js - mobile navigation: hamburger menu (when 2+ links) + floating tool button.
   Progressive enhancement; desktop layout is unchanged. Shared across all pages. */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var header = document.querySelector('header.site');
    if (!header) return;
    var wrap = header.querySelector('.wrap') || header;
    var nav = header.querySelector('nav.site');
    var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];

    // Hamburger - only when there is more than one menu item.
    if (nav && links.length >= 2 && !header.querySelector('.nav-toggle')) {
      var btn = document.createElement('button');
      btn.className = 'nav-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Menu');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span></span>';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = header.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      wrap.appendChild(btn);
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          header.classList.remove('nav-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('click', function (e) {
        if (!header.contains(e.target)) {
          header.classList.remove('nav-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Floating tool button - links to the primary tool (first menu item).
    var primary = links[0];
    if (primary && !document.querySelector('.fab-calc')) {
      var href = primary.getAttribute('href') || '';
      var label = 'Open Calculator';
      if (/quiz/i.test(href)) label = 'Take the Quiz';
      else if (/planner/i.test(href)) label = 'Open Planner';
      var here = location.pathname.replace(/\/+$/, '/');
      var target = href.replace(/^[a-z]+:\/\/[^/]+/i, '').replace(/\/+$/, '/');
      if (here !== target) {
        var fab = document.createElement('a');
        fab.className = 'fab-calc';
        fab.href = href;
        fab.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="18"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="12" y1="14" x2="12" y2="14"/></svg>' +
          '<span>' + label + '</span>';
        document.body.appendChild(fab);
      }
    }

    // Scroll-reveal for inner-page content blocks (home pages already animate via .reveal/.lp-reveal).
    if ('IntersectionObserver' in window && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      var targets = document.querySelectorAll('main .split:not(.reveal):not(.lp-reveal), main .calc-table-wrap, main > .wrap > .faq, main > .wrap > ul.sources');
      if (targets.length) {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -8% 0px' });
        targets.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < vh * 0.9) { el.classList.add('reveal-up', 'in'); } // already visible: reveal without hiding (no flash)
          else { el.classList.add('reveal-up'); io.observe(el); }
        });
      }
    }
  });
})();
