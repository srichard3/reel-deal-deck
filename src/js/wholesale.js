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
  /* Clear the mismatch message the moment they start correcting it, so the
     field is not stuck red while they retype. */
  var pwA = document.getElementById('ws-password');
  var pwB = document.getElementById('ws-password2');
  if (pwB && typeof pwB.setCustomValidity === 'function') {
    var clear = function () { pwB.setCustomValidity(''); };
    pwB.addEventListener('input', clear);
    if (pwA) pwA.addEventListener('input', clear);
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

  function focusField(name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (el && el.focus) el.focus();
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
    /* Check the two passwords match before the browser's own validation runs,
       so "those do not match" arrives in the same pass as every other field
       error rather than as a second round trip. The server checks it again —
       this is a courtesy, not the rule. */
    var pw = form.querySelector('#ws-password');
    var pw2 = form.querySelector('#ws-password2');
    if (pw && pw2 && typeof pw2.setCustomValidity === 'function') {
      pw2.setCustomValidity(pw.value === pw2.value ? '' : 'Those two passwords do not match.');
    }

    if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

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
          if (r.body.fields && r.body.fields.length) focusField(r.body.fields[0]);
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
