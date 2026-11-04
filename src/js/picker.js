/* /what-fly-to-use/ — the three-question filter.
 *
 * Same contract as the other forms on this site: the fieldset ships HIDDEN and
 * this file reveals it, so with JS off a reader gets the whole library and no
 * broken control. Nothing is fetched, stored or navigated — it sets `hidden`
 * on list items, so the worst a failure can do is show all of them.
 *
 * The "no flies match" copy is NOT an error state. Nothing rises in January
 * and there are no hoppers in the snow, so those combinations are correct
 * answers to the question asked, and the message says what to try instead. A
 * bare "0 results" would have thrown away the most useful sentence on the page.
 * The copy comes from a JSON block the page renders, so the strings stay in the
 * page module with the rest of the prose rather than hiding in here.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-pick]');
  var list = document.querySelector('[data-pick-list]');
  if (!form || !list) return;

  var items = [].slice.call(list.querySelectorAll('.pfly'));
  var count = document.querySelector('[data-pick-count]');
  var nothing = document.querySelector('[data-pick-nothing]');
  var hint = document.querySelector('[data-pick-hint]');
  if (!items.length) return;

  var copy = {};
  var block = document.querySelector('[data-pick-nothing-copy]');
  if (block) { try { copy = JSON.parse(block.textContent) || {}; } catch (e) { copy = {}; } }

  /* The hint under question one, keyed off the radio's own label so the two
     can never disagree. Read from the DOM rather than duplicated here. */
  var hints = {};
  [].forEach.call(form.querySelectorAll('input[name="sit"]'), function (el) {
    hints[el.value] = el.getAttribute('data-hint') || '';
  });

  form.hidden = false;

  function picked(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  function apply() {
    var sit = picked('sit');
    var season = picked('season');
    var diff = picked('diff');
    var shown = 0;

    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var ok = true;
      if (sit && (' ' + el.getAttribute('data-f-sit') + ' ').indexOf(' ' + sit + ' ') === -1) ok = false;
      if (ok && season && (' ' + el.getAttribute('data-f-season') + ' ').indexOf(' ' + season + ' ') === -1) ok = false;
      if (ok && diff === 'beginner' && el.getAttribute('data-f-diff') !== 'beginner') ok = false;
      el.hidden = !ok;
      if (ok) shown++;
    }

    if (count) {
      count.textContent = shown === 1
        ? 'One fly fits'
        : shown + ' flies fit';
    }

    if (nothing) {
      var key = sit + '|' + season;
      if (shown === 0) {
        nothing.innerHTML = copy[key] ||
          'Nothing in the library matches all three answers. Widen the last one, or try <strong>nothing showing</strong>.';
        nothing.hidden = false;
      } else {
        nothing.hidden = true;
      }
    }

    if (hint && sit && hints[sit]) hint.textContent = hints[sit];
  }

  form.addEventListener('change', apply);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  apply();
})();
