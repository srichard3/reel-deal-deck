/* ==========================================================================
   THE REEL DEAL DECK — site.js
   --------------------------------------------------------------------------
   Progressive enhancement only. Zero dependencies, loaded with `defer`.
   Every block is independently guarded: if its element is missing, it does
   nothing and the rest still runs. With JS off the site is fully usable.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  function on(el, type, fn, opts) {
    if (el && el.addEventListener) el.addEventListener(type, fn, opts);
  }

  /* ------------------------------------------------------------- theme -- */
  /* The inline script in head.html has already applied the stored theme so
     there is no flash; here we only handle the toggle and the icon state.  */

  var THEME_KEY = 'rdd-theme';
  var ICON = { light: '☼', dark: '☾' }; /* white sun / last-quarter moon */

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function systemTheme() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  }

  function activeTheme() {
    return root.dataset.theme || storedTheme() || systemTheme();
  }

  function paintToggles(theme) {
    var isDark = theme === 'dark';
    var toggles = doc.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < toggles.length; i++) {
      var btn = toggles[i];
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      var icon = btn.querySelector('[data-theme-icon]');
      /* show the theme you would switch TO */
      if (icon) icon.textContent = isDark ? ICON.light : ICON.dark;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
    paintToggles(theme);
  }

  (function initTheme() {
    var toggles = doc.querySelectorAll('[data-theme-toggle]');
    paintToggles(activeTheme());
    for (var i = 0; i < toggles.length; i++) {
      on(toggles[i], 'click', function () {
        applyTheme(activeTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    /* follow the OS until the visitor has expressed a preference */
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var listen = mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : null;
      if (listen) listen(function () { if (!storedTheme()) paintToggles(systemTheme()); });
    } catch (e) { /* no matchMedia */ }
  })();

  /* -------------------------------------------------------- mobile nav -- */

  (function initNav() {
    var toggle = doc.querySelector('[data-nav-toggle]');
    var panel = toggle && doc.getElementById(toggle.getAttribute('aria-controls') || 'mobile-nav');
    if (!toggle || !panel) return;

    function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      if (open) {
        var first = panel.querySelector('a, button');
        if (first) first.focus();
      }
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      setOpen(false);
      if (returnFocus) toggle.focus();
    }

    on(toggle, 'click', function () { setOpen(!isOpen()); });

    on(doc, 'keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') close(true);
    });

    /* close on outside click and after following a link */
    on(doc, 'click', function (e) {
      if (!isOpen()) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      close(false);
    });

    on(panel, 'click', function (e) {
      if (e.target.closest && e.target.closest('a')) close(false);
    });

    /* the desktop nav takes over above 62rem — never leave the panel stuck */
    try {
      var wide = window.matchMedia('(min-width: 62rem)');
      var handler = function (m) { if (m.matches) close(false); };
      if (wide.addEventListener) wide.addEventListener('change', handler);
      handler(wide);
    } catch (e) { /* no matchMedia */ }
  })();

  /* ---------------------------------------------------- scrolled header -- */

  (function initHeader() {
    var header = doc.querySelector('[data-header]') || doc.querySelector('.site-header');
    if (!header) return;

    var ticking = false;

    function paint() {
      ticking = false;
      var y = window.pageYOffset || doc.documentElement.scrollTop || 0;
      header.classList.toggle('is-scrolled', y > 4);
    }

    function request() {
      if (ticking) return;
      ticking = true;
      (window.requestAnimationFrame || function (f) { setTimeout(f, 16); })(paint);
    }

    on(window, 'scroll', request, { passive: true });
    on(window, 'resize', request, { passive: true });
    paint();
  })();

  /* --------------------------------------------------------- copyright -- */

  (function initYear() {
    var year = String(new Date().getFullYear());
    var nodes = doc.querySelectorAll('[data-year]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  })();

  /* ------------------------------------------------------- current page -- */

  (function initCurrent() {
    var here = location.pathname.replace(/index\.html$/, '');
    if (here.length > 1 && here.slice(-1) !== '/') here += '/';

    var links = doc.querySelectorAll(
      '.site-nav__list a, .mobile-nav a:not(.btn), .site-footer__nav a'
    );

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute('href') || '';
      if (!href || href.charAt(0) !== '/') continue;      /* skip external + hash */
      var path = href.split('#')[0].split('?')[0];
      if (path.length > 1 && path.slice(-1) !== '/') path += '/';
      if (path === here) link.setAttribute('aria-current', 'page');
    }
  })();
})();
