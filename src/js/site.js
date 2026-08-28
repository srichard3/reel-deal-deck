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

  /* head.html ships two media-scoped <meta name="theme-color"> tags, which the
     OS honours but a manual override cannot reach. Once the visitor has picked
     a theme explicitly, publish an unscoped tag carrying the page's real
     background so the browser chrome follows the choice. The value is read
     back out of the cascade rather than hard-coded, so tokens.css stays the
     single source of truth. No stored preference? No tag, and the media
     queries keep doing their job. */
  function paintThemeColor() {
    var meta = doc.querySelector('meta[name="theme-color"][data-rdd-theme-color]');
    if (!storedTheme()) {
      if (meta && meta.parentNode) meta.parentNode.removeChild(meta);
      return;
    }
    var bg;
    try { bg = getComputedStyle(doc.body).backgroundColor; } catch (e) { return; }
    if (!bg || bg === 'transparent' || bg.indexOf('rgba(0, 0, 0, 0)') === 0) return;
    if (!meta) {
      meta = doc.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('data-rdd-theme-color', '');
      doc.head.appendChild(meta);
    }
    meta.setAttribute('content', bg);
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
    paintToggles(theme);
    paintThemeColor();
  }

  (function initTheme() {
    var toggles = doc.querySelectorAll('[data-theme-toggle]');
    paintToggles(activeTheme());
    paintThemeColor();
    for (var i = 0; i < toggles.length; i++) {
      on(toggles[i], 'click', function () {
        applyTheme(activeTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    /* follow the OS until the visitor has expressed a preference */
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var listen = mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : null;
      if (listen) listen(function () { if (!storedTheme()) { paintToggles(systemTheme()); } });
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

    /* The panel covers the page on a phone, so Tab must not walk out of it
       into the content behind. Cycle within the panel plus its own toggle;
       Escape and the outside-click handler below are the ways out. */
    function tabbables() {
      var out = [toggle];
      var nodes = panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea');
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.offsetWidth || n.offsetHeight || n.getClientRects().length) out.push(n);
      }
      return out;
    }

    on(doc, 'keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') { close(true); return; }
      if (e.key !== 'Tab' || !isOpen()) return;
      var items = tabbables();
      if (items.length < 2) return;
      var first = items[0];
      var last = items[items.length - 1];
      var active = doc.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active) && active !== toggle)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
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

    /* Publish the header's measured height so scroll-padding-top for #anchor
       jumps is exact instead of the --s-9 guess base.css falls back to.
       Costs one read per resize; never runs without JS, and the fallback is
       generous enough that nothing lands under the header either way. */
    function measure() {
      var h = header.offsetHeight;
      if (h > 0) root.style.setProperty('--rdd-header-h', h + 'px');
    }

    function paint() {
      ticking = false;
      var y = window.pageYOffset || doc.documentElement.scrollTop || 0;
      header.classList.toggle('is-scrolled', y > 4);
      measure();
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

      if (path === here) {
        link.setAttribute('aria-current', 'page');
        continue;
      }

      /* Section ancestry: a fly page (/flies/adams/) should show that you are
         inside the Fly-brary. That is NOT aria-current="page" — this link
         does not point at the current page — so it is marked with a data
         attribute and styled with a quieter rule, leaving the ARIA honest. */
      if (path.length > 1 && here.indexOf(path) === 0) {
        link.setAttribute('data-section-current', '');
      }
    }
  })();
})();


/* ==========================================================================
   Campaign bar dismissal. The bar renders from the shell on every route, so
   this lives in the sitewide bundle. Dismissal is keyed to the campaign
   STATE, so when the Kickstarter ends and the bar switches to pre-order
   copy, a reader who hid the old one sees the new one.
   Progressive enhancement: with JS off the bar simply stays visible.
   ========================================================================== */
(function () {
  'use strict';

  var PREFIX = 'rdd-campaign-dismissed:';

  function get(key) {
    try { return localStorage.getItem(PREFIX + key); } catch (e) { return null; }
  }
  function set(key) {
    try { localStorage.setItem(PREFIX + key, '1'); } catch (e) { /* private mode */ }
  }

  var bars = document.querySelectorAll('[data-campaign-bar]');

  for (var i = 0; i < bars.length; i++) {
    (function (bar) {
      var key = bar.getAttribute('data-campaign-key') || 'default';
      var btn = bar.querySelector('[data-campaign-dismiss]');

      /* Defaults to visible: only an explicit stored dismissal hides it. */
      if (get(key)) {
        bar.hidden = true;
        return;
      }

      if (!btn) return;
      btn.hidden = false;

      btn.addEventListener('click', function () {
        set(key);
        bar.hidden = true;
        /* Focus must not vanish into a hidden subtree. */
        var main = document.getElementById('main');
        if (main) {
          if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
          try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); }
        }
      });
    })(bars[i]);
  }
})();

/* ---------------------------------------------------------------- instagram --
 * Pause control for the revolving Instagram strip.
 *
 * The motion itself is pure CSS, so the strip works with JS off. What CSS
 * cannot provide is the pause mechanism WCAG 2.2.2 requires for anything that
 * moves for more than five seconds: :hover and :focus-within cover a mouse and
 * a keyboard, but leave a touch user with no way to stop it. The button is
 * injected rather than shipped in the markup so it can never appear without a
 * handler behind it.
 *
 * prefers-reduced-motion already stops the animation in CSS, so no button is
 * added there — there is nothing to pause.
 */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var strips = document.querySelectorAll('[data-ig]');

  for (var i = 0; i < strips.length; i++) {
    (function (strip) {
      var track = strip.querySelector('[data-ig-track]');
      if (!track) return;

      /* In the header beside "Follow", not floating over the strip: a control
         laid on top of the artwork covered a post's date, and a pause button
         nobody can find does not satisfy 2.2.2 anyway. */
      var slot = (strip.closest('.ig-section') || document)
        .querySelector('[data-ig-actions]');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ig__pause';
      btn.textContent = 'Pause';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Pause the Instagram strip');

      btn.addEventListener('click', function () {
        var paused = strip.classList.toggle('is-paused');
        btn.textContent = paused ? 'Play' : 'Pause';
        btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        btn.setAttribute('aria-label',
          (paused ? 'Play' : 'Pause') + ' the Instagram strip');
      });

      if (slot) slot.appendChild(btn);
      else strip.appendChild(btn);

      /* Off-screen it animates to nobody, which is wasted battery on a phone.
         The paused-by-button state must survive scrolling past, so this only
         toggles a separate class. */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          for (var j = 0; j < entries.length; j++) {
            track.style.animationPlayState =
              entries[j].isIntersecting ? '' : 'paused';
          }
        }, { threshold: 0 }).observe(strip);
      }
    })(strips[i]);
  }
})();
