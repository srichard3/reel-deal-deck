/* ==========================================================================
   THE REEL DEAL DECK — blog.js
   --------------------------------------------------------------------------
   Progressive enhancement only, loaded with `defer`. Exactly one job:
   let a reader dismiss the campaign announcement bar and have it stay
   dismissed.

   With JS off the bar renders, reads fine, and simply cannot be dismissed —
   which is why the close button ships `hidden` and is revealed here. A dead
   button is worse than no button.

   The dismissal is keyed to the campaign STATE ("live" / "after"), so when the
   campaign ends and the copy changes, a reader who hid the old bar sees the
   new one. Hiding an announcement is not a permanent opt-out of all future
   announcements.
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
