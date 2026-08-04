/* Fly Library filter — progressive enhancement only.
   With JS off, every fly is already in the HTML grouped by type and the filter
   form stays hidden. This script reveals the form and filters in place. */
(function () {
  'use strict';

  var form = document.querySelector('[data-fly-filter]');
  var dataEl = document.getElementById('fly-index');
  if (!form || !dataEl) return;

  var index;
  try {
    index = JSON.parse(dataEl.textContent);
  } catch (e) {
    return; // leave the no-JS listing exactly as it is
  }

  var cards = {};
  Array.prototype.forEach.call(document.querySelectorAll('.playing-card[href^="/flies/"]'), function (el) {
    var m = el.getAttribute('href').match(/\/flies\/([^/]+)\//);
    if (m) cards[m[1]] = el;
  });

  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-fly-group]'));
  var statusEl = form.querySelector('[data-fly-status]');
  var emptyEl = document.querySelector('[data-fly-empty]');
  var clearBtn = document.querySelector('[data-fly-clear]');

  var fields = {
    q: form.querySelector('#fly-q'),
    type: form.querySelector('#fly-type'),
    season: form.querySelector('#fly-season'),
    water: form.querySelector('#fly-water'),
    species: form.querySelector('#fly-species'),
  };

  form.hidden = false;
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* ---- read initial state from the URL (footer links to /flies/?type=dry) -- */
  var params = new URLSearchParams(location.search);
  Object.keys(fields).forEach(function (k) {
    var v = params.get(k);
    if (v && fields[k]) fields[k].value = v;
  });

  function matches(item, state) {
    if (state.type && item.t !== state.type) return false;
    if (state.season && item.se.indexOf(state.season) === -1) return false;
    if (state.water && item.w.indexOf(state.water) === -1) return false;
    if (state.species && item.sp.indexOf(state.species) === -1) return false;
    if (state.q) {
      var hay = (item.n + ' ' + item.i + ' ' + item.k + ' ' + item.t + ' ' +
                 item.d + ' ' + item.se.join(' ') + ' ' + item.w.join(' ') + ' ' +
                 item.sp.join(' ')).toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return false;
      }
    }
    return true;
  }

  function apply() {
    var state = {
      q: fields.q ? fields.q.value.trim() : '',
      type: fields.type ? fields.type.value : '',
      season: fields.season ? fields.season.value : '',
      water: fields.water ? fields.water.value : '',
      species: fields.species ? fields.species.value : '',
    };

    var shown = 0;
    var perGroup = {};
    index.forEach(function (item) {
      var el = cards[item.s];
      if (!el) return;
      var ok = matches(item, state);
      el.hidden = !ok;
      if (ok) {
        shown++;
        perGroup[item.t] = (perGroup[item.t] || 0) + 1;
      }
    });

    groups.forEach(function (g) {
      var t = g.getAttribute('data-fly-group');
      var n = perGroup[t] || 0;
      g.hidden = n === 0;
      var counter = g.querySelector('[data-fly-count]');
      if (counter) counter.textContent = String(n);
    });

    if (emptyEl) emptyEl.hidden = shown !== 0;

    var filtered = state.q || state.type || state.season || state.water || state.species;
    if (statusEl) {
      statusEl.textContent = filtered
        ? shown + (shown === 1 ? ' fly matches' : ' flies match') + ' your filters.'
        : 'Showing all ' + index.length + ' flies.';
    }

    /* Keep the URL shareable without polluting history. */
    var qs = new URLSearchParams();
    Object.keys(state).forEach(function (k) { if (state[k]) qs.set(k, state[k]); });
    var next = location.pathname + (qs.toString() ? '?' + qs : '');
    try { history.replaceState(null, '', next); } catch (e) {}
  }

  var timer;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(apply, 90);
  }

  Object.keys(fields).forEach(function (k) {
    var el = fields[k];
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', schedule);
  });

  form.addEventListener('reset', function () { setTimeout(apply, 0); });
  if (clearBtn) {
    clearBtn.addEventListener('click', function () { form.reset(); setTimeout(apply, 0); });
  }

  apply();
})();
