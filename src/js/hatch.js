/* Match the Hatch — the homepage game.
 *
 * One card is shown large: "what is this fly imitating?" Three named insect
 * families are offered. Get it right and the bug drifts in and the trout eats
 * it; get it wrong and the trout comes up, looks, and turns away.
 *
 * The direction matters. The first version asked the player to pick a fly from
 * three small card faces given an insect, which is unplayable: identifying a
 * tied fly's insect family from artwork is expert knowledge, and three-up the
 * cards were far too small to read anyway. Naming the three answers and showing
 * one card large makes it a fair guess instead of an exam.
 *
 * The card's own printed line is the answer key, so it is cropped off while the
 * question stands and revealed as the explanation afterwards — the deck
 * teaching in its own words, which is the whole premise of the product.
 *
 * Progressive enhancement: with JS off the scene is a still illustration and no
 * buttons appear. prefers-reduced-motion drops the drift and the rise.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-hatch]');
  var dataEl = document.getElementById('hatch-data');
  if (!root || !dataEl) return;

  var DATA;
  try { DATA = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var FAMS = DATA.fams ? Object.keys(DATA.fams) : [];
  if (!DATA.flies || DATA.flies.length < 3 || FAMS.length < 3) return;

  var cardImg  = root.querySelector('[data-hatch-img]');
  var cardName = root.querySelector('[data-hatch-name]');
  var revFam   = root.querySelector('[data-hatch-fam]');
  var revQuote = root.querySelector('[data-hatch-quote]');
  var bug      = root.querySelector('[data-hatch-bug]');
  var choices  = root.querySelector('[data-hatch-choices]');
  var status   = root.querySelector('[data-hatch-status]');
  var scoreEl  = root.querySelector('[data-hatch-score]');
  if (!cardImg || !cardName || !bug || !choices || !status) return;

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

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
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
    var hadFocus = choices.contains(document.activeElement);
    root.classList.remove('is-rise', 'is-refusal', 'is-revealed');
    bug.classList.remove('is-drifting');
    bug.innerHTML = '';
    if (revFam) revFam.textContent = '';
    if (revQuote) revQuote.textContent = '';

    var fly = pick(DATA.flies);
    round = fly;

    cardImg.src = BASE + fly.img + '-800.webp';
    cardImg.alt = 'The ' + fly.name + ' card from the deck';
    cardName.textContent = fly.name;

    var others = FAMS.filter(function (f) { return f !== fly.fam; });
    var opts = shuffle([fly.fam].concat(shuffle(others).slice(0, 2)));

    choices.innerHTML = opts.map(function (f) {
      return '<button class="hatch__opt" type="button" data-fam="' + f + '">' +
        '<span class="hatch__opt-bug" aria-hidden="true">' + DATA.fams[f].bug + '</span>' +
        '<span class="hatch__opt-name">' + DATA.fams[f].label + '</span>' +
        '</button>';
    }).join('');

    setStatus('What is this fly imitating?', '');
    locked = false;

    /* Dealing a round replaces the buttons, so a keyboard player would lose
       their place. Put them back on the first option — but only if they were
       already in the choices, so we never steal focus from the rest of page. */
    if (hadFocus && choices.firstChild) choices.firstChild.focus();
  }

  /* --------------------------------------------------------------- answer */

  function answer(fam, btn) {
    if (locked || !round) return;
    locked = true;

    var ok = fam === round.fam;
    var truth = DATA.fams[round.fam];
    played++;

    /* aria-disabled rather than disabled: a disabled button is removed from
       the tab order, which dropped a keyboard player's focus to <body> the
       instant they answered. The `locked` guard already makes them inert. */
    Array.prototype.forEach.call(choices.children, function (el) {
      el.setAttribute('aria-disabled', 'true');
      if (el.dataset.fam === round.fam) el.classList.add('is-correct');
      else if (el === btn) el.classList.add('is-wrong');
    });

    /* The real insect drifts in only now — showing it beside the question
       would have been the answer. */
    bug.innerHTML = truth.bug;
    bug.classList.add('is-drifting');

    /* Open the crop so the card's own printed line becomes readable. */
    root.classList.add('is-revealed');
    if (revFam) revFam.textContent = 'The ' + round.name + ' imitates ' + truth.article + '.';
    if (revQuote) revQuote.textContent = '\u201c' + round.text + '\u201d';

    if (ok) {
      right++; streak++;
      if (streak > best) best = streak;
      root.classList.add('is-rise');
      setStatus(streak > 2 ? 'Eaten. You have got its number.' : 'Right — up it comes.', 'hit');
    } else {
      streak = 0;
      root.classList.add('is-refusal');
      /* Name what it is NOT. "That is a caddis fly" read as though caddis
         were the answer. */
      setStatus('Not quite — it is not a ' + DATA.fams[fam].label.toLowerCase() + '.', 'miss');
    }

    score();
    clearTimeout(timer);
    timer = setTimeout(newRound, reduced ? 1600 : 3400);
  }

  choices.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.hatch__opt') : null;
    if (btn && choices.contains(btn)) answer(btn.dataset.fam, btn);
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
