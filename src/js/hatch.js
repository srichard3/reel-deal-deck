/* Match the Hatch — the homepage game.
 *
 * A bug drifts down the current. Three real cards from the deck slide up and
 * you pick the fly that matches it. Right, and the trout rises and eats.
 * Wrong, and it comes up, looks, and turns away — which is what a refusal
 * actually is.
 *
 * The rounds are built from data/flies.json at build time and embedded as
 * JSON, so the cards in play are always real cards from the deck.
 *
 * Progressive enhancement: with JS off the scene is a still illustration and
 * the card buttons never appear. prefers-reduced-motion drops the drift and
 * the rise to near-instant state changes.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-hatch]');
  var dataEl = document.getElementById('hatch-data');
  if (!root || !dataEl) return;

  var DATA;
  try { DATA = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var TYPES = Object.keys(DATA.flies);
  if (TYPES.length < 3) return;

  var scene = root.querySelector('[data-hatch-scene]');
  var bug = root.querySelector('[data-hatch-bug]');
  var fish = root.querySelector('[data-hatch-fish]');
  var ring = root.querySelector('[data-hatch-ring]');
  var label = root.querySelector('[data-hatch-label]');
  var choices = root.querySelector('[data-hatch-choices]');
  var status = root.querySelector('[data-hatch-status]');
  var scoreEl = root.querySelector('[data-hatch-score]');
  if (!bug || !fish || !choices || !status) return;

  /* applyBase() in build.mjs rewrites src/href attributes but not JSON string
     values, so the card paths in the embedded data are still root-relative.
     Recover the prefix from this script's own (rewritten) src. */
  var me = document.querySelector('script[src*="hatch.js"]');
  var BASE = me ? me.getAttribute('src').replace(/\/js\/hatch\.js.*$/, '') : '';

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  var right = 0, played = 0, streak = 0, best = 0;
  var round = null;
  var locked = true;
  var timer = 0;

  root.classList.add('hatch--live');

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function setStatus(text, tone) {
    status.textContent = text;
    status.dataset.tone = tone || '';
  }

  function score() {
    if (!scoreEl) return;
    scoreEl.textContent = played
      ? right + ' of ' + played + (best > 1 ? ' · best run ' + best : '')
      : '';
  }

  /* ---------------------------------------------------------------- round */

  function newRound() {
    locked = true;
    root.classList.remove('is-rise', 'is-refusal');
    if (ring) ring.style.setProperty('--ring', '0');

    var type = pick(TYPES);
    var correct = pick(DATA.flies[type]);
    var others = TYPES.filter(function (t) { return t !== type; });
    var wrong = shuffle(others).slice(0, 2).map(function (t) { return pick(DATA.flies[t]); });

    round = { type: type, correct: correct.slug };

    /* the drifting bug */
    bug.innerHTML = DATA.bugs[type] || '';
    bug.classList.remove('is-drifting');
    void bug.offsetWidth;                 /* restart the drift animation */
    bug.classList.add('is-drifting');
    /* The answer is NOT written here. Hiding it with opacity would still leave
       it in the accessibility tree, so a screen reader would read the answer
       out before the player had chosen. It is set in answer() instead. */
    if (label) label.textContent = '';

    /* the three cards */
    var cards = shuffle([correct].concat(wrong));
    choices.innerHTML = cards.map(function (f) {
      return '<button class="hatch__card" type="button" data-slug="' + f.slug + '">' +
        '<img src="' + BASE + f.img + '-400.webp" alt="" width="400" height="559" loading="lazy" decoding="async">' +
        '<span class="hatch__card-name">' + f.name + '</span>' +
        '</button>';
    }).join('');

    setStatus('What is on the water? Pick the fly that matches.', '');
    locked = false;
  }

  /* --------------------------------------------------------------- answer */

  function answer(slug, btn) {
    if (locked || !round) return;
    locked = true;

    var ok = slug === round.correct;
    played++;

    Array.prototype.forEach.call(choices.children, function (el) {
      el.disabled = true;
      if (el.dataset.slug === round.correct) el.classList.add('is-correct');
      else if (el === btn) el.classList.add('is-wrong');
    });

    var bugName = DATA.names[round.type] || round.type;
    if (label) label.textContent = bugName;

    if (ok) {
      right++; streak++;
      if (streak > best) best = streak;
      root.classList.add('is-rise');
      if (ring) ring.style.setProperty('--ring', '1');
      setStatus(streak > 2 ? 'Eaten. You have got its number.' : 'Up it comes. Eaten.', 'hit');
    } else {
      streak = 0;
      root.classList.add('is-refusal');
      setStatus('A look, then a refusal. It was on ' + bugName + '.', 'miss');
    }

    score();
    clearTimeout(timer);
    timer = setTimeout(newRound, reduced ? 900 : 1900);
  }

  choices.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.hatch__card') : null;
    if (btn && choices.contains(btn)) answer(btn.dataset.slug, btn);
  });

  /* Deal the first round straight away. The observer only pauses the drift
     while the section is off-screen — gating the first deal on it meant any
     browser where it did not fire showed an empty game. */
  newRound();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        root.classList.toggle('is-paused', !en.isIntersecting);
      });
    }, { threshold: 0 }).observe(root);
  }

})();
