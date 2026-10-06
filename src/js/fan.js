/* The card fan on a phone — hold and drag to walk the deck.
 *
 * On a mouse this file does nothing at all. It returns before touching the DOM
 * unless the pointer is coarse, because the desktop fan is pure CSS — hover
 * lifts a card, a narrow wedge is the hit area, and that works. The whole of
 * this is the answer to one question: what replaces hover on a phone?
 *
 * WHY THE PHONE NEEDED ITS OWN ANSWER
 * -----------------------------------
 * The fan is 7.44 card widths across. At the old 104px card that is 774px, so
 * on a 390px screen half the deck sat outside a scroll container, and each card
 * showed an 11px strip. A tap was a guess, and it navigated immediately: no
 * preview, no way back, and no way to reach most of the deck.
 *
 * So on a coarse pointer the fan is shrunk to fit the screen (CSS does that,
 * off .is-scrubbable) and the gesture changes:
 *
 *   drag      walks the deck, lifting each card as you pass it
 *   release   leaves that card up
 *   tap it    opens it
 *
 * HOW THE CARD UNDER THE FINGER IS FOUND
 * --------------------------------------
 * By asking the browser, not by arithmetic. elementFromPoint at the strip row
 * returns the same wedge that drives hover on desktop, so the two cannot drift
 * apart. That works because EVERYTHING in the fan is pointer-events:none except
 * one wedge per card — including the art, so a card lifted to 2.2x never
 * shadows its neighbours and the hit map is identical lifted or flat. That
 * invariant is load-bearing and it is checked in CLAUDE.md.
 *
 * The wedges are switched off on touch (they would be ~6px), so they are turned
 * back on for the duration of the measurement and off again straight after.
 */
(function () {
  'use strict';

  var stage = document.querySelector('[data-fan-stage]');
  if (!stage) return;

  /* A mouse keeps the CSS fan, untouched. */
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (!coarse) return;

  var fan = stage.querySelector('.fan');
  var pad = stage.querySelector('[data-fan-scrub]');
  if (!fan || !pad) return;

  stage.classList.add('is-scrubbable');

  var cards = Array.prototype.slice.call(fan.querySelectorAll('.fan__card'));
  if (!cards.length) return;

  var picked = null;
  var pointerId = null;
  var startX = 0, startY = 0;
  var scrubbing = false;
  var decided = false;      /* has this gesture committed to an axis yet */
  /* Survives pointerup so the click that follows can be judged. A drag always
     ends with the picked card lifted UNDER the finger, so "did the click land
     on the picked card" is true after every scrub and cannot be the test for
     whether to navigate. This can. */
  var didScrub = false;
  var SLOP = 6;             /* px before a touch counts as a drag */

  function pick(card) {
    if (card === picked) return;
    if (picked) picked.classList.remove('is-picked');
    picked = card;
    if (picked) picked.classList.add('is-picked');
  }

  /* THE LOOKUP TABLE
   * ----------------
   * The fan is an ARC. Cards rotate about a pivot 3.6 card-heights below them,
   * so the middle of the deck rides high and the ends droop: measured here, one
   * row through the middle met cards 15 to 45 and missed the other 23 outright.
   * Probing several rows fixes the coverage but not the feel — which row answers
   * first then depends on where the thumb happens to be vertically, so the same
   * horizontal drag could step backwards as the thumb wandered.
   *
   * So the mapping is built once per gesture and then frozen: for every pixel
   * across the fan, ask the real hit geometry which card is there, force the
   * result to be non-decreasing, and scrub off the table. Selection becomes a
   * pure function of x. Vertical wobble cannot change it, it cannot run
   * backwards, and it still comes from the same wedges that drive hover on a
   * desktop rather than from a second copy of the geometry.
   *
   * It cannot be built at load: elementFromPoint takes VIEWPORT coordinates, and
   * at load the fan is ~1900px below the fold, so every probe returns null. It
   * is built the first time the fan scrolls into view, in idle time — about
   * 65ms of work for a 343px fan, which is far too much to spend inside a
   * pointerdown but free here, since the fan is below the fold and a finger
   * cannot arrive until after it has been scrolled to. pointerdown only falls
   * back to building synchronously if that never happened.
   *
   * The table is cached. Vertical scrolling does not invalidate it, because it
   * is indexed by distance from the fan's left edge and the fan does not move
   * horizontally; only a resize does, which re-lays the whole fan.
   */
  var LADDER = [0.40, 0.46, 0.34, 0.54, 0.28, 0.62, 0.72];
  var table = null, tableLeft = 0, tableWidth = 0;

  function buildTable() {
    var r = fan.getBoundingClientRect();
    /* elementFromPoint reads the viewport, so there is nothing to measure
       against unless the fan is really in it. Returning false matters: the
       caller must not then treat the job as done. */
    if (r.bottom <= 0 || r.top >= window.innerHeight || !r.width) return false;
    var rows = [];
    for (var k = 0; k < LADDER.length; k++) rows.push(r.top + r.height * LADDER[k]);

    var width = Math.ceil(r.width);
    var t = new Array(width);
    var last = -1;

    fan.classList.add('is-probing');
    for (var px = 0; px < width; px++) {
      var x = r.left + px, found = -1;
      for (var j = 0; j < rows.length && found < 0; j++) {
        var el = document.elementFromPoint(x, rows[j]);
        var c = el && el.closest ? el.closest('.fan__card') : null;
        if (c) found = cards.indexOf(c);
      }
      /* Non-decreasing by construction: a drag to the right can only ever move
         further into the deck, whatever the arc does between rows. */
      if (found < last) found = last;
      t[px] = found;
      if (found > last) last = found;
    }
    fan.classList.remove('is-probing');

    /* Anything before the first card the probe found belongs to the first card. */
    for (var i = 0; i < width && t[i] < 0; i++) t[i] = 0;

    table = t;
    tableLeft = r.left;
    tableWidth = r.width;

    measureNudges();
    return true;
  }

  /* KEEPING A LIFTED CARD ON SCREEN
   * ------------------------------
   * A card at --fan-pop stands up far wider than its 6px strip, and at the ends
   * of the arc it is rotated as well. Measured at 320px: the first and last
   * cards reached 53px past each edge of the screen, which is both a third of
   * the card lost and a horizontal scrollbar on the whole document.
   *
   * Shrinking the pop would fix it by making the preview useless — the lifted
   * card is the only thing you can actually read on a phone. So instead each
   * card gets a one-off horizontal offset that slides it back inside the
   * viewport, measured here rather than modelled: pop each card, read where it
   * actually lands, and write the correction to --nudge. Done once, so a scrub
   * across all 54 costs nothing.
   */
  function measureNudges() {
    var vw = document.documentElement.clientWidth;
    var M = 8;                                   /* breathing room at the edge */
    fan.classList.add('is-calibrating');         /* no transition to wait on */

    for (var i = 0; i < cards.length; i++) {
      var art = cards[i].querySelector('.fan__art');
      if (!art) continue;
      art.style.setProperty('--nudge-at', '0px');
      cards[i].classList.add('is-picked');

      var b = art.getBoundingClientRect();
      var need = overhang(b, vw, M);

      if (need) {
        /* translateX runs along the CARD's own x-axis, and the card is rotated:
           at the ends of the arc by nearly 40 degrees. So a 61px nudge moved the
           first card only 47px across the screen, and it still hung off the
           edge. Rather than model that with a cosine, measure the response —
           apply a known offset, see how far it actually travelled sideways, and
           scale by what comes back. Two corrections are plenty for something
           this linear; the loop stops as soon as it is within a pixel. */
        var probe = 10;
        art.style.setProperty('--nudge-at', probe + 'px');
        var moved = art.getBoundingClientRect().left - b.left;
        var ratio = Math.abs(moved) > 0.01 ? moved / probe : 1;

        var nudge = need / ratio;
        for (var pass = 0; pass < 3; pass++) {
          art.style.setProperty('--nudge-at', nudge.toFixed(2) + 'px');
          var r2 = art.getBoundingClientRect();
          var left = overhang(r2, vw, M);
          if (Math.abs(left) < 1) break;
          nudge += left / ratio;
        }
      }

      cards[i].classList.remove('is-picked');
    }
    fan.classList.remove('is-calibrating');
  }

  /* How far this box has to move sideways to sit inside the screen. A card too
     wide to fit is centred instead of jammed against one edge. */
  function overhang(b, vw, M) {
    if (b.width > vw - 2 * M) return (vw / 2) - (b.left + b.width / 2);
    if (b.left < M) return M - b.left;
    if (b.right > vw - M) return (vw - M) - b.right;
    return 0;
  }

  /* Build as soon as the fan is really on screen, in idle time, so the ~65ms of
     probing is spent long before a finger arrives.

     The observer keeps watching until a build actually SUCCEEDS. Disconnecting
     on the first callback is wrong: with a rootMargin it fires while the fan is
     still below the fold, where every probe returns null — the build bails, the
     observer is already gone, and the calibration never runs. */
  /* The timeout matters: without it a tab that never goes idle (or is in the
     background) would leave the build to the first pointerdown, where it costs
     ~79ms before the first card lifts. With it, the browser runs the callback
     within 1.2s whatever else is happening. */
  var idle = window.requestIdleCallback
    ? function (fn) { return window.requestIdleCallback(fn, { timeout: 1200 }); }
    : function (fn) { return setTimeout(fn, 1); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      idle(function () { if (!table && buildTable()) io.disconnect(); });
    }, { threshold: 0 });
    io.observe(stage);
  }

  /* A resize re-lays the fan and changes the viewport the nudges were measured
     against, so both are thrown away and rebuilt. */
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    table = null;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { idle(function () { if (!table) buildTable(); }); }, 200);
  });

  function scrubTo(clientX) {
    if (!table) return;
    var px = Math.round(clientX - tableLeft);
    if (px < 0) px = 0;
    if (px >= table.length) px = table.length - 1;
    var i = table[px];
    if (i >= 0 && cards[i]) pick(cards[i]);
  }

  stage.addEventListener('pointerdown', function (e) {
    if (pointerId !== null) return;
    pointerId = e.pointerId;
    startX = e.clientX; startY = e.clientY;
    scrubbing = false; decided = false; didScrub = false;
    /* The table survives scrolling, but the fan's viewport x does not, so that
       one number is refreshed per gesture. Building here is the fallback for a
       table the idle pass never got to. */
    if (!table) buildTable();
    else tableLeft = fan.getBoundingClientRect().left;
  }, true);

  stage.addEventListener('pointermove', function (e) {
    if (e.pointerId !== pointerId) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;

    if (!decided) {
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
      decided = true;
      /* A gesture that is mostly vertical is the reader scrolling the page, and
         touch-action: pan-y has already handed it to the browser. Stay out. */
      if (Math.abs(dy) > Math.abs(dx)) { pointerId = null; return; }
      scrubbing = true;
      didScrub = true;
      /* Capture so the drag keeps coming here even once a card has lifted to
         2.2x under the finger. */
      if (stage.setPointerCapture) { try { stage.setPointerCapture(pointerId); } catch (err) {} }
    }

    if (!scrubbing) return;
    e.preventDefault();
    scrubTo(e.clientX);
  }, true);

  function end(e) {
    if (e.pointerId !== pointerId) return;
    /* A tap that never became a drag: pick the card under it, unless the tap
       landed on the card that is already up — that one is a real link, and the
       click that follows is allowed through to navigate. */
    if (!scrubbing && picked && !picked.contains(e.target)) scrubTo(e.clientX);
    else if (!scrubbing && !picked) scrubTo(e.clientX);
    pointerId = null;
    scrubbing = false;
  }
  stage.addEventListener('pointerup', end, true);
  stage.addEventListener('pointercancel', function (e) {
    if (e.pointerId !== pointerId) return;
    pointerId = null; scrubbing = false;
  }, true);

  /* A drag that ends on a card must not also open it. Nothing about WHERE the
     click landed can decide this: a scrub leaves the picked card lifted under
     the finger, so the release is always on it. Only "was this gesture a drag"
     separates the two, which is what didScrub carries. */
  stage.addEventListener('click', function (e) {
    if (didScrub) { e.preventDefault(); e.stopPropagation(); }
    didScrub = false;
  }, true);

  /* Tapping away puts the deck down. */
  document.addEventListener('pointerdown', function (e) {
    if (picked && !stage.contains(e.target)) pick(null);
  }, true);
})();
