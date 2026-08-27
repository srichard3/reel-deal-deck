/* ==========================================================================
   commerce.js — PLACEHOLDER COMMERCE LAYER
   --------------------------------------------------------------------------
   THIS FILE SENDS NOTHING ANYWHERE. There is no backend, no cart, no
   checkout, no payment processor. It does exactly two things:

     1. Intercepts <form data-capture="..."> submissions, validates them
        client-side, writes the record to localStorage["rdd-captures"], and
        renders an inline success state that says — in plain words — that the
        details were saved in this browser only.

     2. Records [data-add-to-cart] clicks as *interest*, not orders, into
        localStorage["rdd-interest"], updates a count badge, and renders a
        summary panel. No language anywhere implies an order or a payment.

   Progressive enhancement only. Every page is fully readable, navigable and
   understandable with this file removed.

   INTEGRATION SEAM — the one thing a developer needs to replace:

     window.RDD.commerce.onCapture = async (record) => { ... };
     window.RDD.commerce.onInterest = async (interestList, lastItem) => { ... };

   Both are called after the local write and are awaited but never allowed to
   break the UI. Assign your own functions (POST to an ESP, open a Shopify
   cart, redirect to a Stripe Payment Link) from a separate script loaded
   after this one, and delete nothing else. See docs/COMMERCE.md.
   ========================================================================== */

(function () {
  'use strict';

  var CAPTURE_KEY = 'rdd-captures';
  var INTEREST_KEY = 'rdd-interest';
  var CURRENCY = 'USD';

  /* ---------------------------------------------------------- storage -- */

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var val = JSON.parse(raw);
      return Array.isArray(val) ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Private mode / quota / disabled storage. The UI still confirms,
      // because nothing was being transmitted in the first place.
      return false;
    }
  }

  /* ------------------------------------------------------------ seam -- */

  var RDD = (window.RDD = window.RDD || {});

  RDD.commerce = {
    /** Placeholder stub. Replace to POST to a real ESP / CRM. */
    onCapture: function (record) {
      if (window.console && console.info) {
        console.info('[RDD stub] capture stored locally, nothing sent:', record);
      }
    },
    /** Placeholder stub. Replace to add lines to a real cart. */
    onInterest: function (list, lastItem) {
      if (window.console && console.info) {
        console.info('[RDD stub] interest stored locally, nothing sent:', lastItem, list);
      }
    },
    /* Read helpers, handy while wiring the real thing up. */
    getCaptures: function () { return readJSON(CAPTURE_KEY, []); },
    getInterest: function () { return readJSON(INTEREST_KEY, []); },
    clearInterest: function () { writeJSON(INTEREST_KEY, []); renderInterest(); },
    isPlaceholder: true,
  };

  function fire(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    try {
      var fn = RDD.commerce[name];
      if (typeof fn === 'function') {
        var out = fn.apply(RDD.commerce, args);
        if (out && typeof out.catch === 'function') out.catch(function () {});
      }
    } catch (e) {
      /* A broken integration must never break the page. */
    }
  }

  /* ------------------------------------------------------ validation -- */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldLabel(field) {
    var id = field.id;
    var label = id ? document.querySelector('label[for="' + id + '"]') : null;
    var text = label ? label.textContent : field.getAttribute('aria-label') || field.name;
    return String(text || 'This field').replace(/\s*\(optional\)\s*/i, '').replace(/\s+/g, ' ').trim();
  }

  function validate(form) {
    var fields = form.querySelectorAll('input, select, textarea');
    var problems = [];
    var firstBad = null;

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f.type === 'hidden' || f.disabled) continue;
      var value = (f.value || '').trim();
      var bad = false;

      if (f.required && !value) {
        problems.push(fieldLabel(f) + ' is required.');
        bad = true;
      } else if (f.type === 'email' && value && !EMAIL_RE.test(value)) {
        problems.push('That email address does not look right.');
        bad = true;
      } else if (f.type === 'number' && value) {
        var n = Number(value);
        var min = f.min === '' ? null : Number(f.min);
        if (isNaN(n) || (min !== null && n < min)) {
          problems.push(fieldLabel(f) + ' must be at least ' + f.min + '.');
          bad = true;
        }
      }

      if (bad) {
        f.setAttribute('aria-invalid', 'true');
        if (!firstBad) firstBad = f;
      } else {
        f.removeAttribute('aria-invalid');
      }
    }

    return { ok: problems.length === 0, problems: problems, firstBad: firstBad };
  }

  /* ---------------------------------------------------------- status -- */

  function statusEl(form) {
    var el = form.querySelector('[data-capture-status]');
    if (!el) {
      el = document.createElement('div');
      el.setAttribute('data-capture-status', '');
      el.className = 'cx-form__status';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      form.appendChild(el);
    }
    return el;
  }

  function showStatus(form, html, isError) {
    var el = statusEl(form);
    el.className = 'cx-form__status' + (isError ? ' cx-form__status--error' : '');
    el.innerHTML = html;
    el.hidden = false;
  }

  /* ---------------------------------------------------------- capture -- */

  function serialize(form) {
    var data = {};
    var fields = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (!f.name || f.disabled) continue;
      if (f.type === 'checkbox') { data[f.name] = f.checked; continue; }
      if (f.type === 'radio') { if (f.checked) data[f.name] = f.value; continue; }
      data[f.name] = (f.value || '').trim();
    }
    return data;
  }

  function successCopy(kind) {
    switch (kind) {
      case 'wholesale':
        return '<strong>Enquiry saved.</strong> Nothing has been ordered and no account has been opened. ' +
               'This site is pre-launch, so your details were stored in this browser only — ' +
               'email <a href="mailto:reeldealdeck@gmail.com">reeldealdeck@gmail.com</a> and we will reply personally.';
      case 'reserve':
        return '<strong>You are on the list.</strong> This is a reservation of interest, not an order: ' +
               'no payment has been taken and nothing has been charged. ' +
               'We will email you before the first print run goes on sale.';
      case 'gift':
        return '<strong>Saved.</strong> No order has been placed and no payment has been taken. ' +
               'We will email you the moment decks are available to buy, with plenty of notice before the holidays.';
      default:
        return '<strong>Saved.</strong> No order has been placed and no payment has been taken. ' +
               'We will be in touch by email.';
    }
  }

  function handleCapture(form, e) {
    e.preventDefault();

    var result = validate(form);
    if (!result.ok) {
      showStatus(form, '<strong>Please check the form.</strong><br>' + result.problems.join('<br>'), true);
      if (result.firstBad) result.firstBad.focus();
      return;
    }

    var kind = form.getAttribute('data-capture') || 'general';
    var record = {
      kind: kind,
      page: window.location.pathname,
      at: new Date().toISOString(),
      fields: serialize(form),
      interest: kind === 'reserve' ? readJSON(INTEREST_KEY, []) : undefined,
      // Explicit: this record was never transmitted anywhere.
      transmitted: false,
    };

    var list = readJSON(CAPTURE_KEY, []);
    list.push(record);
    var stored = writeJSON(CAPTURE_KEY, list);

    showStatus(form, successCopy(kind) + (stored ? '' :
      '<br><span class="cx-stub">(Your browser blocked local storage, so this was not kept after you leave the page.)</span>'), false);

    form.setAttribute('data-captured', 'true');
    form.reset();
    fire('onCapture', record);

    var status = statusEl(form);
    if (status && typeof status.focus === 'function') {
      status.setAttribute('tabindex', '-1');
      status.focus();
    }
  }

  function bindForms() {
    var forms = document.querySelectorAll('form[data-capture]');
    for (var i = 0; i < forms.length; i++) {
      (function (form) {
        // Stop the mailto: no-JS fallback from firing once JS is available.
        form.setAttribute('data-enhanced', 'true');
        form.setAttribute('novalidate', 'novalidate');
        form.addEventListener('submit', function (e) { handleCapture(form, e); });
      })(forms[i]);
    }
  }

  /* --------------------------------------------------------- interest -- */

  function money(n) {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY,
        minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    } catch (e) {
      return '$' + Math.round(n);
    }
  }

  function renderInterest() {
    var list = readJSON(INTEREST_KEY, []);
    var units = 0, decks = 0, value = 0;

    for (var i = 0; i < list.length; i++) {
      units += list[i].qty;
      decks += list[i].qty * (list[i].decks || 0);
      value += list[i].qty * (list[i].price || 0);
    }

    var badges = document.querySelectorAll('[data-interest-count]');
    for (var b = 0; b < badges.length; b++) {
      badges[b].textContent = String(units);
      badges[b].hidden = units === 0;
    }

    var panels = document.querySelectorAll('[data-interest-panel]');
    for (var p = 0; p < panels.length; p++) panels[p].hidden = list.length === 0;

    var holders = document.querySelectorAll('[data-interest-list]');
    for (var h = 0; h < holders.length; h++) {
      var holder = holders[h];
      holder.innerHTML = '';
      for (var j = 0; j < list.length; j++) {
        var item = list[j];
        var li = document.createElement('li');
        li.className = 'buy-interest__row';

        var name = document.createElement('span');
        name.innerHTML = '<strong>' + escapeHTML(item.label) + '</strong> ' +
          '<span class="buy-interest__meta">&times;' + item.qty + ' &middot; ' +
          money(item.price * item.qty) + ' if it were on sale today</span>';

        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn btn--quiet btn--sm';
        rm.setAttribute('data-interest-remove', item.tier);
        rm.textContent = 'Remove';
        rm.setAttribute('aria-label', 'Remove ' + item.label + ' from your list');

        li.appendChild(name);
        li.appendChild(rm);
        holder.appendChild(li);
      }
    }

    var totals = document.querySelectorAll('[data-interest-total]');
    for (var t = 0; t < totals.length; t++) {
      totals[t].textContent = decks + (decks === 1 ? ' deck' : ' decks') +
        ' — ' + money(value) + ' at today’s intended prices. Nothing is reserved, charged or owed.';
    }
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function qtyFor(btn) {
    var root = btn.closest ? btn.closest('[data-tier-root]') : null;
    var input = root ? root.querySelector('[data-qty]') : null;
    var n = input ? parseInt(input.value, 10) : 1;
    if (!n || n < 1) n = 1;
    if (n > 99) n = 99;
    return n;
  }

  function addInterest(btn) {
    var tier = btn.getAttribute('data-add-to-cart');
    if (!tier) return;

    var price = Number(btn.getAttribute('data-price') || 0);
    var decksIn = Number(btn.getAttribute('data-decks') || 0);
    var label = btn.getAttribute('data-label') || tier;
    var qty = qtyFor(btn);

    var list = readJSON(INTEREST_KEY, []);
    var found = null;
    for (var i = 0; i < list.length; i++) if (list[i].tier === tier) found = list[i];

    if (found) found.qty = Math.min(99, found.qty + qty);
    else {
      found = { tier: tier, label: label, price: price, decks: decksIn, qty: qty, at: new Date().toISOString() };
      list.push(found);
    }

    writeJSON(INTEREST_KEY, list);
    renderInterest();
    fire('onInterest', list, found);

    // Deliberately does NOT say "added to cart".
    var live = document.querySelector('[data-interest-live]');
    if (live) live.textContent = label + ' saved to your list. Nothing has been ordered.';

    var was = btn.getAttribute('data-label-default') || btn.textContent;
    btn.setAttribute('data-label-default', was);
    btn.textContent = 'Saved to your list';
    window.setTimeout(function () { btn.textContent = was; }, 2400);
  }

  function removeInterest(tier) {
    var list = readJSON(INTEREST_KEY, []);
    var next = [];
    for (var i = 0; i < list.length; i++) if (list[i].tier !== tier) next.push(list[i]);
    writeJSON(INTEREST_KEY, next);
    renderInterest();
    fire('onInterest', next, null);
  }

  function bindInterest() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      var add = t.closest('[data-add-to-cart]');
      if (add) { e.preventDefault(); addInterest(add); return; }

      var rm = t.closest('[data-interest-remove]');
      if (rm) { e.preventDefault(); removeInterest(rm.getAttribute('data-interest-remove')); return; }

      var clear = t.closest('[data-interest-clear]');
      if (clear) { e.preventDefault(); RDD.commerce.clearInterest(); return; }
    });
  }

  /* ------------------------------------------------------------- init -- */

  function init() {
    try { bindForms(); } catch (e) {}
    try { bindInterest(); renderInterest(); } catch (e) {}
    // Reveal controls that are only meaningful with JS present.
    var jsOnly = document.querySelectorAll('[data-js-only]');
    for (var i = 0; i < jsOnly.length; i++) jsOnly[i].hidden = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
