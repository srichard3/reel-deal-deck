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
    if (idle) { cancelAnimationFrame(idle); idle = 0; }
  }

  /* ------------------------------------------------------------ pointer -- */

  box.addEventListener('pointerdown', function (e) {
    dragging = true; id = e.pointerId;
    lastX = e.clientX; lastY = e.clientY;
    stopIdle();
    root.classList.add('is-dragging');
    if (box.setPointerCapture) { try { box.setPointerCapture(id); } catch (err) {} }
  });

  box.addEventListener('pointermove', function (e) {
    if (!dragging || e.pointerId !== id) return;
    e.preventDefault();
    ry += (e.clientX - lastX) * 0.55;
    rx -= (e.clientY - lastY) * 0.35;
    rx = Math.max(RX_MIN, Math.min(RX_MAX, rx));
    lastX = e.clientX; lastY = e.clientY;
    apply();
  });

  function release(e) {
    if (!dragging || (e && e.pointerId !== id)) return;
    dragging = false;
    root.classList.remove('is-dragging');
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
    stopIdle();
    apply();
  });

  /* --------------------------------------------------------------- idle -- */
  /* A box that never moves does not look like it can be moved. It drifts until
     the first interaction and then stays where it is put. Off entirely under
     prefers-reduced-motion, and paused off-screen. */

  if (!reduced) {
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
      }, { threshold: 0 }).observe(root);
    }

    var t0 = null;
    var base = ry;
    var loop = function (t) {
      if (touched) return;
      if (t0 === null) t0 = t;
      if (visible) {
        /* A slow sway, not a spin: enough to read as interactive. */
        ry = base + Math.sin((t - t0) / 2600) * 13;
        apply();
      }
      idle = requestAnimationFrame(loop);
    };
    idle = requestAnimationFrame(loop);
  }

  /* A hint, injected so it never appears without the behaviour it describes. */
  var hint = document.createElement('p');
  hint.className = 'tuck__hint';
  hint.textContent = 'Drag to turn it';
  root.appendChild(hint);
})();
