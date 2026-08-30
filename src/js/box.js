/* The tuck box — drag to turn it.
 *
 * The box itself is CSS: six panels from the printer's dieline, folded with
 * transforms, resting at the three-quarter angle set in components.css. All
 * this file does is let you move it, so with JS off the hero is still a 3D box
 * rather than a broken one.
 *
 * Rotation is written to --ry / --rx on the wrapper. The CSS owns the resting
 * angle; once a pointer or a key touches it, this owns them instead.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-tuck]');
  var box = root && root.querySelector('[data-tuck-box]');
  if (!root || !box) return;

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* Start from whatever the stylesheet is already showing, so taking hold of
     the box never makes it jump. */
  var cs = getComputedStyle(root);
  var ry = parseFloat(cs.getPropertyValue('--ry')) || -26;
  var rx = parseFloat(cs.getPropertyValue('--rx')) || -14;

  var dragging = false, touched = false, id = null;
  var lastX = 0, lastY = 0, idle = 0;

  /* Throw physics. vx is degrees of yaw per millisecond — the same unit the
     drag produces, so the box leaves your finger at exactly the speed it was
     moving under it. Horizontal only: the vertical tilt is clamped to a narrow
     band and a thrown tilt would just slam into the stop. */
  var vx = 0, lastMoveT = 0, flingId = 0;
  var FRICTION = 0.9965;   /* per ms — about 1.2s from a firm flick to rest */
  var MIN_V = 0.0015;      /* below this it is not moving, it is drifting */
  var MAX_V = 2.0;         /* cap a violent flick at ~2000 deg/s */
  var STALE_MS = 90;       /* pause before releasing = a place, not a throw */

  /* Tipping further than this shows the box from underneath, where there is
     nothing printed but a glue flap. */
  var RX_MIN = -46, RX_MAX = 34;

  function apply() {
    root.style.setProperty('--ry', ry.toFixed(1) + 'deg');
    root.style.setProperty('--rx', rx.toFixed(1) + 'deg');
  }

  function stopIdle() {
    if (touched) return;
    touched = true;
    root.classList.add('is-touched');
    root.classList.remove('is-animating');
    if (idle) { cancelAnimationFrame(idle); idle = 0; }
  }

  /* ------------------------------------------------------------ pointer -- */

  /* Backstop for the same thing: any dragstart that still reaches the box is
     the browser trying to drag a panel image out of the page. */
  box.addEventListener('dragstart', function (e) { e.preventDefault(); });

  function stopFling() {
    if (flingId) { cancelAnimationFrame(flingId); flingId = 0; }
    root.classList.remove('is-animating');
    vx = 0;
  }

  box.addEventListener('pointerdown', function (e) {
    stopFling();                     /* catching a spinning box stops it */
    dragging = true; id = e.pointerId;
    lastX = e.clientX; lastY = e.clientY;
    lastMoveT = e.timeStamp || performance.now();
    stopIdle();
    root.classList.add('is-dragging');
    if (box.setPointerCapture) { try { box.setPointerCapture(id); } catch (err) {} }
  });

  box.addEventListener('pointermove', function (e) {
    if (!dragging || e.pointerId !== id) return;
    e.preventDefault();
    var now = e.timeStamp || performance.now();
    var dt = Math.max(now - lastMoveT, 1);
    var dRy = (e.clientX - lastX) * 0.55;

    ry += dRy;
    rx -= (e.clientY - lastY) * 0.35;
    rx = Math.max(RX_MIN, Math.min(RX_MAX, rx));

    /* Weighted toward the newest sample but not equal to it: one 1ms frame
       with a few pixels in it would otherwise read as an enormous throw. */
    vx = vx * 0.6 + (dRy / dt) * 0.4;

    lastX = e.clientX; lastY = e.clientY; lastMoveT = now;
    apply();
  });

  function release(e) {
    if (!dragging || (e && e.pointerId !== id)) return;
    dragging = false;
    root.classList.remove('is-dragging');

    /* Letting go after holding still is placing the box, not throwing it. */
    var now = (e && e.timeStamp) || performance.now();
    if (now - lastMoveT > STALE_MS) vx = 0;
    vx = Math.max(-MAX_V, Math.min(MAX_V, vx));
    if (reduced || Math.abs(vx) < MIN_V) { vx = 0; return; }

    root.classList.add('is-animating');   /* frame-driven: no CSS transition */
    var prev = null;
    var glide = function (t) {
      if (prev === null) prev = t;
      /* Clamp dt so a dropped frame cannot teleport the box. */
      var dt = Math.min(t - prev, 50);
      prev = t;
      ry += vx * dt;
      vx *= Math.pow(FRICTION, dt);
      apply();
      if (Math.abs(vx) > MIN_V) flingId = requestAnimationFrame(glide);
      else stopFling();
    };
    flingId = requestAnimationFrame(glide);
  }
  box.addEventListener('pointerup', release);
  box.addEventListener('pointercancel', release);

  /* ----------------------------------------------------------- keyboard -- */

  box.setAttribute('tabindex', '0');
  box.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 45 : 15;
    var handled = true;
    switch (e.key) {
      case 'ArrowLeft':  ry -= step; break;
      case 'ArrowRight': ry += step; break;
      case 'ArrowUp':    rx = Math.max(RX_MIN, rx - step); break;
      case 'ArrowDown':  rx = Math.min(RX_MAX, rx + step); break;
      case 'Home':       ry = -26; rx = -14; break;   /* back to the resting view */
      default: handled = false;
    }
    if (!handled) return;
    e.preventDefault();
    stopFling();
    stopIdle();
    apply();
  });

  /* ------------------------------------------------------- intro + idle -- */
  /* One full turn on arrival, showing all four sides, then a slow sway left to
     right for as long as nobody touches it. The spin is what tells you the box
     is an object rather than a picture; the sway keeps saying it afterwards.

     Both are off under prefers-reduced-motion, and both stop for good on the
     first interaction. The sway pauses off-screen — it is pure battery there. */

  if (!reduced) {
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
      }, { threshold: 0 }).observe(root);
    }

    var base = ry;                 /* the resting angle the sway oscillates about */
    var SPIN_MS = 2200;
    var SWAY_MS = 2600;
    var SWAY_DEG = 13;

    /* Ease out from a fast start: the box is already moving when you notice it,
       and it arrives rather than stops. */
    var easeOut = function (p) { return 1 - Math.pow(1 - p, 3); };

    var start = null;
    var spun = false;

    var frame = function (t) {
      if (touched) return;
      if (start === null) start = t;
      var elapsed = t - start;

      /* Hold the spin until the box has actually been seen. Deep-linking to
         #game, or loading with the tab in the background, would otherwise spend
         the one arrival moment the box gets on an empty screen. */
      if (!spun && !visible) { start = null; idle = requestAnimationFrame(frame); return; }

      if (!spun) {
        var p = Math.min(elapsed / SPIN_MS, 1);
        /* A full 360 back to where it started, so the spin cannot leave the
           box facing away from the reader if it is interrupted. */
        ry = base - 360 * (1 - easeOut(p));
        apply();
        if (p >= 1) { spun = true; start = t; ry = base; }
      } else if (visible) {
        ry = base + Math.sin((t - start) / SWAY_MS) * SWAY_DEG;
        apply();
      }

      idle = requestAnimationFrame(frame);
    };

    /* The 480ms transition in CSS is there to smooth a keyboard step. Against a
       per-frame animation it only adds lag, so it is off while this runs. */
    root.classList.add('is-animating');
    idle = requestAnimationFrame(frame);
  }

  /* A hint, injected so it never appears without the behaviour it describes. */
  var hint = document.createElement('p');
  hint.className = 'tuck__hint';
  hint.textContent = 'Drag to turn it';
  root.appendChild(hint);
})();
