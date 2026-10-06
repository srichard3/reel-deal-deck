/* The tuck box — drag to turn it, from any angle.
 *
 * The box itself is CSS: six panels from the printer's dieline, folded with
 * transforms, resting at the three-quarter angle set in components.css. All
 * this file does is let you move it, so with JS off the hero is still a 3D box
 * rather than a broken one.
 *
 * WHY A MATRIX AND NOT TWO ANGLES
 * -------------------------------
 * This used to write --rx and --ry, and clamp pitch to a 80-degree band so the
 * box could never be turned past vertical. Two reasons that had to go: the base
 * is now a printed panel worth looking at, and Euler angles gimbal-lock. Pitch
 * the box a quarter turn and its yaw axis is lying along the view direction, so
 * dragging sideways spins it in the picture plane instead of turning it — the
 * box stops following your hand exactly when it is at its most interesting.
 *
 * So orientation is held as a 3x3 rotation matrix and every gesture is applied
 * in WORLD space, by pre-multiplication: drag right and the box turns about the
 * screen's vertical axis whatever attitude it is already in. That is what makes
 * it feel like a held object rather than a pair of sliders. CSS still owns the
 * resting pose as two angles, because a pose that never moves does not need
 * more than that; this file overwrites --tf with a matrix3d on first contact.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-tuck]');
  var box = root && root.querySelector('[data-tuck-box]');
  if (!root || !box) return;

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ------------------------------------------------------------ matrix -- */
  /* Row-major 3x3. Small enough that a library would cost more than it saves. */

  function ident() { return [1, 0, 0, 0, 1, 0, 0, 0, 1]; }

  function mul(a, b) {
    var o = new Array(9);
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
      }
    }
    return o;
  }

  /* CSS's own handedness, so these compose exactly as rotateX()/rotateY() do
     and the resting pose below reproduces the stylesheet's to the pixel. */
  function rotX(d) {
    var a = d * Math.PI / 180, s = Math.sin(a), c = Math.cos(a);
    return [1, 0, 0, 0, c, -s, 0, s, c];
  }
  function rotY(d) {
    var a = d * Math.PI / 180, s = Math.sin(a), c = Math.cos(a);
    return [c, 0, s, 0, 1, 0, -s, 0, c];
  }

  /* Thousands of incremental multiplies accumulate rounding error, and a matrix
     that has drifted off orthonormal shears the box. Gram-Schmidt costs about a
     microsecond; running it every frame is cheaper than reasoning about when it
     is needed. */
  function orthonormalize(m) {
    var x = [m[0], m[3], m[6]], y = [m[1], m[4], m[7]];
    var lx = Math.hypot(x[0], x[1], x[2]) || 1;
    x = [x[0] / lx, x[1] / lx, x[2] / lx];
    var d = x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
    y = [y[0] - d * x[0], y[1] - d * x[1], y[2] - d * x[2]];
    var ly = Math.hypot(y[0], y[1], y[2]) || 1;
    y = [y[0] / ly, y[1] / ly, y[2] / ly];
    var z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
    return [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]];
  }

  /* Turn the box by yaw about the screen's vertical and pitch about its
     horizontal — in that frame, not the box's. Pre-multiplication is the whole
     trick: post-multiplying would turn it about its own axes, which is the
     behavior that made the old version feel stuck once it was tipped over. */
  function turn(yaw, pitch) {
    if (!yaw && !pitch) return;
    m = orthonormalize(mul(mul(rotX(pitch), rotY(yaw)), m));
  }

  function fromEuler(rx, ry) { return mul(rotX(rx), rotY(ry)); }

  /* ------------------------------------------------------------- state -- */

  /* Start from whatever the stylesheet is already showing, so taking hold of
     the box never makes it jump. */
  var cs = getComputedStyle(root);
  var restRx = parseFloat(cs.getPropertyValue('--rx')) || -14;
  var restRy = parseFloat(cs.getPropertyValue('--ry')) || -26;
  var m = fromEuler(restRx, restRy);

  var dragging = false, touched = false, id = null;
  var lastX = 0, lastY = 0, idle = 0;

  /* Throw physics. Degrees per millisecond — the same unit the drag produces,
     so the box leaves your finger at the speed it was moving under it. Both
     axes now, because both axes now go all the way round. */
  var vYaw = 0, vPitch = 0, lastMoveT = 0, flingId = 0;
  var FRICTION = 0.9965;   /* per ms — about 1.2s from a firm flick to rest */
  var MIN_V = 0.0015;      /* below this it is not moving, it is drifting */
  var MAX_V = 2.0;         /* cap a violent flick at ~2000 deg/s */
  var STALE_MS = 90;       /* pause before releasing = a place, not a throw */
  var YAW_PER_PX = 0.55;
  var PITCH_PER_PX = 0.45;

  function apply() {
    /* CSS matrix3d is column-major, so each group of four below is a column. */
    root.style.setProperty('--tf',
      'matrix3d(' + [m[0], m[3], m[6], 0,
                     m[1], m[4], m[7], 0,
                     m[2], m[5], m[8], 0,
                     0, 0, 0, 1].map(function (n) {
                       return Math.abs(n) < 1e-6 ? 0 : +n.toFixed(6);
                     }).join(',') + ')');
  }

  function stopIdle() {
    if (touched) return;
    touched = true;
    root.classList.add('is-touched');
    root.classList.remove('is-animating');
    if (idle) { cancelAnimationFrame(idle); idle = 0; }
  }

  /* ------------------------------------------------------------ pointer -- */

  /* Backstop: any dragstart that still reaches the box is the browser trying to
     drag a panel image out of the page. */
  box.addEventListener('dragstart', function (e) { e.preventDefault(); });

  function stopFling() {
    if (flingId) { cancelAnimationFrame(flingId); flingId = 0; }
    root.classList.remove('is-animating');
    vYaw = vPitch = 0;
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

    var dYaw = (e.clientX - lastX) * YAW_PER_PX;
    /* touch-action: pan-y hands vertical gestures to the page, so on a phone
       this is zero and the browser is already scrolling. Nothing to special-case
       — the events simply do not arrive. */
    var dPitch = -(e.clientY - lastY) * PITCH_PER_PX;
    turn(dYaw, dPitch);

    /* Weighted toward the newest sample but not equal to it: one 1ms frame with
       a few pixels in it would otherwise read as an enormous throw. */
    vYaw = vYaw * 0.6 + (dYaw / dt) * 0.4;
    vPitch = vPitch * 0.6 + (dPitch / dt) * 0.4;

    lastX = e.clientX; lastY = e.clientY; lastMoveT = now;
    apply();
  });

  function clampV(v) { return Math.max(-MAX_V, Math.min(MAX_V, v)); }

  function release(e) {
    if (!dragging || (e && e.pointerId !== id)) return;
    dragging = false;
    root.classList.remove('is-dragging');

    /* Letting go after holding still is placing the box, not throwing it. */
    var now = (e && e.timeStamp) || performance.now();
    if (now - lastMoveT > STALE_MS) { vYaw = vPitch = 0; }
    vYaw = clampV(vYaw); vPitch = clampV(vPitch);

    var speed = Math.hypot(vYaw, vPitch);
    if (reduced || speed < MIN_V) { vYaw = vPitch = 0; return; }

    root.classList.add('is-animating');   /* frame-driven: no CSS transition */
    var prev = null;
    var glide = function (t) {
      if (prev === null) prev = t;
      /* Clamp dt so a dropped frame cannot teleport the box. */
      var dt = Math.min(t - prev, 50);
      prev = t;
      turn(vYaw * dt, vPitch * dt);
      var decay = Math.pow(FRICTION, dt);
      vYaw *= decay; vPitch *= decay;
      apply();
      if (Math.hypot(vYaw, vPitch) > MIN_V) flingId = requestAnimationFrame(glide);
      else stopFling();
    };
    flingId = requestAnimationFrame(glide);
  }
  box.addEventListener('pointerup', release);
  box.addEventListener('pointercancel', release);

  /* ----------------------------------------------------------- keyboard -- */
  /* The only way to reach the top and the base without a mouse, now that both
     are printed panels — so the arrows are not a nicety here. */

  box.setAttribute('tabindex', '0');
  box.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 45 : 15;
    var handled = true;
    switch (e.key) {
      case 'ArrowLeft':  turn(-step, 0); break;
      case 'ArrowRight': turn(step, 0); break;
      case 'ArrowUp':    turn(0, -step); break;
      case 'ArrowDown':  turn(0, step); break;
      case 'Home':       m = fromEuler(restRx, restRy); break;  /* resting view */
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
     first interaction. The sway pauses off-screen — it is pure battery there.

     This stays in Euler angles: it is a scripted pose about one axis from a
     known start, which is exactly the case Euler angles are good at. */

  if (!reduced) {
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
      }, { threshold: 0 }).observe(root);
    }

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

      /* Hold the spin until the box has actually been seen. Deep-linking past
         the hero, or loading with the tab in the background, would otherwise
         spend the one arrival moment the box gets on an empty screen. */
      if (!spun && !visible) { start = null; idle = requestAnimationFrame(frame); return; }

      if (!spun) {
        var p = Math.min(elapsed / SPIN_MS, 1);
        /* A full 360 back to where it started, so the spin cannot leave the box
           facing away from the reader if it is interrupted. */
        m = fromEuler(restRx, restRy - 360 * (1 - easeOut(p)));
        apply();
        if (p >= 1) { spun = true; start = t; m = fromEuler(restRx, restRy); }
      } else if (visible) {
        m = fromEuler(restRx, restRy + Math.sin((t - start) / SWAY_MS) * SWAY_DEG);
        apply();
      }

      idle = requestAnimationFrame(frame);
    };

    /* The 480ms transition in CSS is there to smooth a keyboard step. Against a
       per-frame animation it only adds lag, so it is off while this runs. */
    root.classList.add('is-animating');
    idle = requestAnimationFrame(frame);
  } else {
    apply();
  }

  /* A hint, injected so it never appears without the behavior it describes. */
  var hint = document.createElement('p');
  hint.className = 'tuck__hint';
  hint.textContent = 'Drag to turn it';
  root.appendChild(hint);
})();
