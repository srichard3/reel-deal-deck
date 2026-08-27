/* The rise — a one-button hook-set game.
 *
 * The timing is not arbitrary: it is the lesson from /blog/how-to-set-the-hook/.
 * A trout takes a dry fly on the way up and closes its mouth on the way DOWN,
 * so striking at the splash pulls the fly out of an open mouth. Wait for the
 * turn. The windows below encode exactly that.
 *
 * Progressive enhancement: with JS off the markup renders as a still scene and
 * the controls stay hidden. With prefers-reduced-motion the rise is instant and
 * the game becomes a reaction prompt rather than an animation.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-rise]');
  if (!root || !window.requestAnimationFrame) return;

  var fish = root.querySelector('[data-rise-fish]');
  var ring = root.querySelector('[data-rise-ring]');
  var btn = root.querySelector('[data-rise-strike]');
  var status = root.querySelector('[data-rise-status]');
  var scoreEl = root.querySelector('[data-rise-score]');
  if (!fish || !btn || !status) return;

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* Milliseconds from the start of a rise. */
  var RISE = reduced ? 260 : 950;   /* fish travels up to the fly            */
  var TURN = RISE + 420;            /* it has turned down — strike by here   */
  var GONE = RISE + 900;            /* spat out                              */

  var t0 = 0;               /* rise start, 0 when idle          */
  var raf = 0;
  var waiting = 0;          /* timer id for the next rise       */
  var hooked = 0;
  var cast = 0;
  var streak = 0;

  root.classList.add('rise--live');

  function setStatus(text, tone) {
    status.textContent = text;
    status.dataset.tone = tone || '';
  }

  function score() {
    if (!scoreEl) return;
    scoreEl.textContent = cast === 0
      ? ''
      : hooked + ' hooked of ' + cast + (streak > 1 ? ' · ' + streak + ' in a row' : '');
  }

  /* The fish sits at y=0 when deep and y=1 at the fly. */
  function place(p, turning) {
    fish.style.setProperty('--rise-p', p.toFixed(3));
    fish.style.setProperty('--rise-turn', turning ? '1' : '0');
  }

  function reset(delay) {
    t0 = 0;
    place(0, false);
    if (ring) ring.style.setProperty('--ring', '0');
    btn.disabled = false;
    clearTimeout(waiting);
    waiting = setTimeout(begin, delay);
  }

  function begin() {
    t0 = performance.now();
    cast++;
    setStatus('Something is coming up…', '');
    score();
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!t0) return;
    var t = now - t0;

    if (t < RISE) {
      place(t / RISE, false);
    } else if (t < TURN) {
      /* At the surface, then turning over. This is the window. */
      place(1, t > RISE + 140);
      if (ring) ring.style.setProperty('--ring', String(Math.min(1, (t - RISE) / 320)));
    } else if (t < GONE) {
      place(1 - (t - TURN) / (GONE - TURN), true);
    } else {
      /* Missed it entirely. */
      t0 = 0;
      streak = 0;
      setStatus('Gone. You can wait too long as well.', 'miss');
      score();
      reset(1400);
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function strike() {
    if (!t0) {
      /* Striking at nothing. */
      setStatus('Nothing there yet. Wait for the rise.', 'early');
      return;
    }
    var t = performance.now() - t0;
    cancelAnimationFrame(raf);
    t0 = 0;
    btn.disabled = true;

    if (t < RISE) {
      streak = 0;
      setStatus('Too soon — it had not even reached the fly.', 'early');
    } else if (t < RISE + 140) {
      streak = 0;
      setStatus('Struck the splash. The fly came out of an open mouth.', 'early');
    } else if (t < TURN) {
      hooked++;
      streak++;
      setStatus(streak > 2 ? 'Fish on. You have the rhythm now.' : 'Fish on. That is the turn.', 'hit');
      root.classList.add('is-hooked');
      setTimeout(function () { root.classList.remove('is-hooked'); }, 700);
    } else {
      streak = 0;
      setStatus('A beat late — it had already let go.', 'miss');
    }
    score();
    reset(1500);
  }

  btn.addEventListener('click', strike);

  /* Space and Enter while the game has focus, without hijacking the page. */
  root.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === btn) return;   /* the button handles its own keys */
      e.preventDefault();
      strike();
    }
  });

  /* Only run while it is actually on screen — no point animating off-screen,
     and it keeps the tab cheap. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (!t0 && !waiting) reset(600);
        } else {
          clearTimeout(waiting);
          waiting = 0;
          cancelAnimationFrame(raf);
          t0 = 0;
          place(0, false);
        }
      });
    }, { threshold: 0.35 }).observe(root);
  } else {
    reset(600);
  }

  setStatus('Wait for the rise, then set the hook.', '');
})();
