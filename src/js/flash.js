/* Fly-brary flashcards.
 *
 * Name on the front, what it imitates on the back. That is the association the
 * printed deck teaches, and the one worth practising — which is why the prompt
 * is the name and not the artwork: every card face has the answer printed on
 * it, so showing the picture first would give the game away.
 *
 * Progressive enhancement. With this file absent the markup renders both sides
 * stacked and no controls appear, so the reader still gets the information —
 * they just do not get to test themselves on it.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-flash]');
  var dataEl = document.getElementById('flash-data');
  if (!root || !dataEl) return;

  var CARDS;
  try { CARDS = JSON.parse(dataEl.textContent).cards; } catch (e) { return; }
  if (!CARDS || !CARDS.length) return;

  var card = root.querySelector('[data-flash-card]');
  var elIdx = root.querySelector('[data-flash-idx]');
  var elName = root.querySelector('[data-flash-name]');
  var elCat = root.querySelector('[data-flash-cat]');
  var elImit = root.querySelector('[data-flash-imitates]');
  var elMeta = root.querySelector('[data-flash-meta]');
  var elText = root.querySelector('[data-flash-text]');
  var elLink = root.querySelector('[data-flash-link]');
  if (!card || !elName || !elImit) return;

  /* applyBase() rewrites src/href attributes but not JSON string values, so the
     slugs here are still root-relative. Recover the prefix from this script's
     own (rewritten) src — the same trick feed.js uses. */
  var me = document.querySelector('script[src*="flash.js"]');
  var BASE = me ? me.getAttribute('src').replace(/\/js\/flash\.js.*$/, '') : '';

  var order = CARDS.map(function (_, i) { return i; });
  var at = 0;
  var shown = false;

  root.classList.add('flash--live');

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ------------------------------------------------------------- render -- */

  function render() {
    var c = CARDS[order[at]];
    elIdx.textContent = c.idx || '';
    elIdx.setAttribute('data-suit', c.suit || '');
    elName.textContent = c.name;
    elCat.textContent = c.cat || '';
    elImit.textContent = c.imitates;

    var bits = [];
    if (c.cat) bits.push(c.cat);
    if (c.sizes) bits.push(c.sizes);
    elMeta.textContent = bits.join(' · ');

    elText.textContent = c.text || '';
    elLink.setAttribute('href', BASE + '/flies/' + c.slug + '/');
    elLink.textContent = 'Read the ' + c.name + ' page →';

    setShown(false);
    /* Position, never a total. The library carries the bonus card as well as
       the 54, so "1 of 55" would put a number on screen that contradicts the
       one printed on the tuck box. The page head above states no total for the
       same reason. */
    counter.textContent = 'Card ' + (at + 1);
  }

  function setShown(v) {
    shown = v;
    root.classList.toggle('is-shown', v);
    card.setAttribute('aria-expanded', v ? 'true' : 'false');
    flipBtn.textContent = v ? 'Hide the answer' : 'Show the answer';
  }

  function step(n) {
    at = (at + n + order.length) % order.length;
    render();
  }

  /* ----------------------------------------------------------- controls -- */
  /* Injected, so they can never appear without the behaviour behind them. */

  var bar = document.createElement('div');
  bar.className = 'flash__bar';

  function button(label, cls, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn--sm ' + cls;
    b.textContent = label;
    b.addEventListener('click', fn);
    return b;
  }

  var prevBtn = button('← Previous', 'btn--quiet', function () { step(-1); });
  var flipBtn = button('Show the answer', 'btn--primary', function () { setShown(!shown); });
  var nextBtn = button('Next →', 'btn--quiet', function () { step(1); });

  var counter = document.createElement('p');
  counter.className = 'flash__count';
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');

  var shuffleBtn = button('Shuffle', 'btn--quiet', function () {
    shuffle(order); at = 0; render();
  });

  bar.appendChild(prevBtn);
  bar.appendChild(flipBtn);
  bar.appendChild(nextBtn);
  root.appendChild(bar);

  var foot = document.createElement('div');
  foot.className = 'flash__foot';
  foot.appendChild(counter);
  foot.appendChild(shuffleBtn);
  root.appendChild(foot);

  /* The card itself flips — it is the obvious thing to click. A button rather
     than a div so it is reachable and announced without inventing roles. */
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.addEventListener('click', function () { setShown(!shown); });
  card.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShown(!shown); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });

  render();
})();
