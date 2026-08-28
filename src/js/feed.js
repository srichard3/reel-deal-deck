/* Feed the Trout — the homepage game.
 *
 * The trout wants one particular fly. Three cards drift on the surface. Tap the
 * one whose artwork matches the fly in the trout's bubble and it rises to that
 * exact card, breaks the surface and takes it.
 *
 * It is a matching game, not a quiz: nothing here requires knowing anything
 * about fly fishing. An earlier version asked the player to name what a fly
 * imitated, which is an exam with a trout drawn next to it. The fish is now the
 * point — every correct tap is answered by the rise, which is the moment the
 * whole sport is actually about.
 *
 * Wrong taps cost nothing but a beat. There is no timer and no fail state; the
 * only number kept is how many the trout has eaten.
 *
 * Progressive enhancement: with JS off the scene is a still illustration and no
 * cards appear. prefers-reduced-motion swaps the arc for a quiet fade.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-feed]');
  var dataEl = document.getElementById('feed-data');
  if (!root || !dataEl) return;

  var CARDS;
  try { CARDS = JSON.parse(dataEl.textContent).cards; } catch (e) { return; }
  if (!CARDS || CARDS.length < 3) return;

  var scene   = root.querySelector('[data-feed-scene]');
  var water   = root.querySelector('[data-feed-water]');
  var wantImg = root.querySelector('[data-feed-want]');
  var row     = root.querySelector('[data-feed-row]');
  var status  = root.querySelector('[data-feed-status]');
  var scoreEl = root.querySelector('[data-feed-score]');
  if (!scene || !water || !wantImg || !row || !status) return;

  /* applyBase() in build.mjs rewrites src/href attributes but not JSON string
     values, so the card paths in the embedded data are still root-relative.
     Recover the prefix from this script's own (rewritten) src. */
  var me = document.querySelector('script[src*="feed.js"]');
  var BASE = me ? me.getAttribute('src').replace(/\/js\/feed\.js.*$/, '') : '';

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* Must match the viewBox on .feed__water — the fish is positioned in these
     user units, and the tap target is measured in CSS pixels. */
  var VB_W = 400;
  var HOLD_X = 145, HOLD_Y = 64;    /* where the trout idles */
  var NOSE_X = 5.4;                 /* the scaled nose within the fish group */
  var FISH_W = 111;                 /* nose to tail tip, scaled */

  var fed = 0, streak = 0, best = 0;
  var want = null;
  var locked = true;
  var timer = 0;

  root.classList.add('feed--live');

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Card names come from data/flies.json, so nothing hostile is expected — but
     the row is built with innerHTML, and four names already carry apostrophes.
     A future name with a quote or an ampersand should not be able to break the
     markup it is written into. */
  function esc(v) {
    return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function setStatus(text, tone) {
    status.textContent = text;
    status.dataset.tone = tone || '';
  }

  function score() {
    if (!scoreEl) return;
    scoreEl.textContent = fed
      ? fed + (fed === 1 ? ' fly eaten' : ' flies eaten') +
        (best > 1 ? ' · best run ' + best : '')
      : '';
  }

  /* ---------------------------------------------------------------- round */

  function deal() {
    clearTimeout(timer);
    locked = true;
    var hadFocus = row.contains(document.activeElement);
    root.classList.remove('is-take', 'is-refuse', 'is-flip');
    row.innerHTML = '';

    var three = shuffle(CARDS.slice()).slice(0, 3);
    want = three[Math.floor(Math.random() * three.length)];

    wantImg.src = BASE + want.img + '-400.webp';
    wantImg.alt = 'The trout wants the ' + want.name + ' card';

    row.innerHTML = shuffle(three).map(function (c, i) {
      return '<button class="feed__card" type="button" data-slug="' + esc(c.slug) + '"' +
        ' style="--bob:' + (i * 0.7).toFixed(2) + 's"' +
        ' aria-label="Feed the trout the ' + esc(c.name) + '">' +
        '<img class="feed__card-img" src="' + esc(BASE + c.img) + '-400.webp"' +
        ' width="572" height="800" alt="" decoding="async" loading="lazy">' +
        '<span class="feed__card-name">' + esc(c.name) + '</span>' +
        '</button>';
    }).join('');

    setStatus('Tap the fly the trout is after.', '');
    locked = false;
    if (hadFocus && row.firstChild) row.firstChild.focus();
  }

  /* ------------------------------------------------------------- the rise */

  /* Aim the arc at the card that was actually tapped, so the trout comes up
     under that card rather than at a fixed spot. Measured in CSS pixels and
     converted into the SVG's user units.

     The fish also turns to face the fly. That is what a trout does, and it is
     also the only way it reaches the far card: drawn facing left it occupies
     111 units to the right of its nose, so an unmirrored rise to the third card
     would put its tail outside the frame. */
  function aimAt(btn) {
    var s = scene.getBoundingClientRect();
    var b = btn.getBoundingClientRect();
    if (!s.width) return { x: HOLD_X, nose: HOLD_X + NOSE_X, flip: false };
    var cx = ((b.left + b.width / 2) - s.left) / s.width * VB_W;
    var flip = cx > HOLD_X + NOSE_X;
    var x = flip
      ? Math.min(VB_W, Math.max(FISH_W, cx + NOSE_X))
      : Math.max(0, Math.min(VB_W - FISH_W, cx - NOSE_X));
    return { x: x, nose: flip ? x - NOSE_X : x + NOSE_X, flip: flip };
  }

  function choose(slug, btn) {
    if (locked || !want) return;

    if (slug !== want.slug) {
      /* No penalty beyond a beat: the cards stay, the trout just turns off it.
         Punishing a miss would make a toy feel like a test. */
      streak = 0;
      btn.classList.remove('is-wrong');
      void btn.offsetWidth;                 /* restart the shake if repeated */
      btn.classList.add('is-wrong');
      root.classList.remove('is-refuse');
      void root.offsetWidth;
      root.classList.add('is-refuse');
      setStatus('Not that one — look again.', 'miss');
      return;
    }

    locked = true;
    fed++; streak++;
    if (streak > best) best = streak;

    /* A miss earlier in this round leaves .is-refuse on the root, and its
       keyframes are declared after the rise's, so they would win the transform
       and the fish would never come up. */
    root.classList.remove('is-refuse');
    var aim = aimAt(btn);
    root.classList.toggle('is-flip', aim.flip);
    root.style.setProperty('--fx1', aim.x.toFixed(1) + 'px');
    root.style.setProperty('--rx', aim.nose.toFixed(1) + 'px');
    btn.classList.add('is-taken');
    Array.prototype.forEach.call(row.children, function (el) {
      el.setAttribute('aria-disabled', 'true');
      if (el !== btn) el.classList.add('is-fading');
    });

    root.classList.add('is-take');
    setStatus(streak > 2 ? 'Eaten — you have got its number.' : 'Eaten.', 'hit');
    score();

    timer = setTimeout(deal, reduced ? 1100 : 2100);
  }

  row.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.feed__card') : null;
    if (btn && row.contains(btn)) choose(btn.dataset.slug, btn);
  });

  /* The trout's resting position lives in CSS so the keyframes can return to
     it, but the numbers belong with the geometry above. */
  root.style.setProperty('--fx0', HOLD_X + 'px');
  root.style.setProperty('--fy0', HOLD_Y + 'px');

  /* Deal straight away. The observer only pauses the idle sway while the
     section is off-screen — gating the first deal on it meant any browser
     where it did not fire showed an empty game. */
  deal();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        root.classList.toggle('is-paused', !en.isIntersecting);
      });
    }, { threshold: 0 }).observe(root);
  }
})();
