/* /gifts/ — the three-question filter over the ten gifts.
 *
 * The form ships HIDDEN and this file reveals it, the same contract the
 * wholesale form uses: with JS off a reader gets all ten gifts and no broken
 * control. Nothing here navigates, fetches or stores anything — it sets
 * `hidden` on list items and nothing else, so the worst a failure can do is
 * leave the full list on screen, which is the correct fallback anyway.
 *
 * The budget answer is a CEILING, not a band. Somebody who says "under $25"
 * wants to be shown only the cheap ones; somebody who says "more than $100"
 * is telling you what they CAN spend, not what they must, so they still see
 * everything. Filtering band 3 down to band 3 alone would hide the deck from
 * the most willing buyer on the page.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-gpick]');
  var list = document.querySelector('[data-gift-list]');
  if (!form || !list) return;

  var items = [].slice.call(list.querySelectorAll('.gift'));
  var count = document.querySelector('[data-gpick-count]');
  var empty = document.querySelector('[data-gpick-empty]');
  if (!items.length) return;

  /* We are here, so the control can work. */
  form.hidden = false;

  function picked(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : 'any';
  }

  function matches(el, who, budget, risk) {
    if (who !== 'any') {
      var forWho = (el.getAttribute('data-g-who') || '').split(/\s+/);
      if (forWho.indexOf(who) === -1) return false;
    }
    if (budget !== 'any') {
      /* ceiling, not equality — see the header */
      if (Number(el.getAttribute('data-g-budget')) > Number(budget)) return false;
    }
    if (risk === 'low' && el.getAttribute('data-g-risk') !== 'low') return false;
    return true;
  }

  function apply() {
    var who = picked('who');
    var budget = picked('budget');
    var risk = picked('risk');
    var shown = 0;

    for (var i = 0; i < items.length; i++) {
      var ok = matches(items[i], who, budget, risk);
      items[i].hidden = !ok;
      if (ok) shown++;
    }

    if (count) {
      count.textContent = shown === items.length
        ? 'Showing all ' + items.length
        : 'Showing ' + shown + ' of ' + items.length;
    }
    if (empty) empty.hidden = shown !== 0;
  }

  form.addEventListener('change', apply);
  /* Not on submit — there is nothing to submit. Guard anyway so a stray Enter
     in the fieldset cannot reload the page and silently reset the answers. */
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  apply();
})();
