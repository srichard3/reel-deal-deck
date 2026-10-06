/* wholesale.js — /wholesale/apply/
 *
 * Posts the application to /api/wholesale-apply and follows the cart URL it
 * returns. The form is hidden in the markup and revealed here, because without
 * JavaScript a native POST would navigate the reader to raw JSON — the noscript
 * block offers the email route instead, which actually works.
 *
 * Every check in here is a courtesy that saves a round trip. The function
 * re-validates all of it; nothing in a browser is a control.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-ws-apply]');
  if (!form) return;

  var status = form.querySelector('[data-ws-status]');

  /* Show only the state list that belongs to the chosen country. The server
     re-checks the pair, so this is a courtesy — but without it the list offers
     Ontario to somebody who picked the United States, and the only feedback
     would arrive after they had filled in the whole form. */
  var countrySel = form.querySelector('[name="country"]');
  var regionSel = form.querySelector('[name="region"]');
  if (countrySel && regionSel && regionSel.tagName === 'SELECT') {
    var syncRegions = function () {
      var want = countrySel.value;
      var groups = regionSel.querySelectorAll('optgroup');
      var chosenStillValid = false;
      for (var i = 0; i < groups.length; i++) {
        var mine = groups[i].getAttribute('data-country') === want;
        /* disabled, not hidden: Safari ignores display:none on an optgroup,
           and a disabled group cannot be chosen by keyboard either. */
        groups[i].disabled = !mine;
        groups[i].style.display = mine ? '' : 'none';
        if (mine && regionSel.value) {
          var opts = groups[i].querySelectorAll('option');
          for (var j = 0; j < opts.length; j++) {
            if (opts[j].value === regionSel.value) chosenStillValid = true;
          }
        }
      }
      if (!chosenStillValid) regionSel.selectedIndex = -1;
    };
    countrySel.addEventListener('change', syncRegions);
    syncRegions();
  }

  var submit = form.querySelector('[data-ws-submit]');
  var file = form.querySelector('#ws-permit');

  /* The form ships hidden so a no-JS reader is never shown a control that
     cannot work. We are here, so it can work. */
  form.hidden = false;

  var MAX = 10 * 1024 * 1024;
  var BUSY = 'Setting up your account…';

  function say(msg, kind) {
    status.textContent = msg || '';
    status.className = 'ws-apply__status' + (kind ? ' is-' + kind : '');
  }

  /* Focusing the bad field is not enough on a form this long: the reader is
     often looking at the message by the button, several fields away, and
     nothing on screen says WHICH one. Mark it, and clear the mark the moment
     they start fixing it rather than leaving the field red while they type. */
  function clearInvalid() {
    var marked = form.querySelectorAll('[aria-invalid="true"]');
    for (var i = 0; i < marked.length; i++) marked[i].removeAttribute('aria-invalid');
  }

  function markFields(names) {
    clearInvalid();
    if (!names || !names.length) return;
    for (var i = 0; i < names.length; i++) {
      var el = form.querySelector('[name="' + names[i] + '"]');
      if (!el) continue;
      el.setAttribute('aria-invalid', 'true');
      if (!el.dataset.wsBound) {
        el.dataset.wsBound = '1';
        el.addEventListener('input', function () { this.removeAttribute('aria-invalid'); });
        el.addEventListener('change', function () { this.removeAttribute('aria-invalid'); });
      }
    }
    var first = form.querySelector('[name="' + names[0] + '"]');
    if (first && first.focus) first.focus();
    if (first && first.scrollIntoView) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  if (file) {
    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (f && f.size > MAX) {
        say('That file is ' + Math.round(f.size / 1048576) + 'MB. The limit is 10MB — a photo or a PDF scan is plenty.', 'error');
        file.value = '';
      } else if (f) {
        say(f.name + ' attached.', 'ok');
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submit.disabled) return;

    /* Let the browser's own validation speak first — it is better at this and
       it is localised. */
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

    clearInvalid();
    submit.disabled = true;
    var label = submit.textContent;
    submit.textContent = BUSY;
    say(BUSY);

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (res) {
        /* Belt and braces for the one way this can go wrong silently: the page
           is live but the function is not deployed, so /api/wholesale-apply is
           a 404 HTML page and res.json() throws. Without this the reader is
           told their connection failed, which is a lie about their wifi. */
        return res.text().then(function (text) {
          try {
            return { res: res, body: JSON.parse(text) };
          } catch (e) {
            return { res: res, body: { error: res.status === 404
              ? 'Online signup is not switched on yet. Please email us and we will set the account up by hand.'
              : 'That did not go through. Please email us and we will set the account up by hand.' } };
          }
        });
      })
      .then(function (r) {
        if (!r.res.ok) {
          say(r.body.error || 'That did not go through. Please try again.', 'error');
          markFields(r.body.fields);
          return;
        }
        if (r.body.pending) {
          say('Thank you — your application is in. We will email you once it is approved.', 'ok');
          form.querySelector('.ws-form__grid').hidden = true;
          submit.hidden = true;
          return;
        }
        if (r.body.redirect) {
          say('You are set up. Taking you to your order page…', 'ok');
          /* assign, not replace: a reader who lands on the cart and hits back
             should get this page, not a dead end. */
          window.location.assign(r.body.redirect);
          return;
        }
        say('You are set up. We will email your account details shortly.', 'ok');
      })
      .catch(function () {
        say('We could not reach the server. Check your connection and try again.', 'error');
      })
      .then(function () {
        if (!submit.hidden) { submit.disabled = false; submit.textContent = label; }
      });
  });
})();
