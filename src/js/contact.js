/* contact.js — /contact/
 *
 * Posts the contact form to /api/contact, which emails it on. Separate from
 * commerce.js's data-capture handling on purpose: that writes to localStorage
 * and says so in its success message ("saved in this browser only"), which
 * stops being true the moment a message is actually sent.
 *
 * The form ships hidden in the markup and is revealed here, the same way the
 * wholesale form is: without JavaScript a native POST would navigate the
 * reader to raw JSON, so the noscript block offers a route that works instead.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-contact]');
  if (!form) return;

  var status = form.querySelector('[data-contact-status]');
  var submit = form.querySelector('[data-contact-submit]');
  form.hidden = false;

  function say(msg, kind) {
    if (!status) return;
    status.textContent = msg || '';
    status.className = 'cx-form__status' + (kind ? ' is-' + kind : '');
  }

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
      if (!el.dataset.ctBound) {
        el.dataset.ctBound = '1';
        el.addEventListener('input', function () { this.removeAttribute('aria-invalid'); });
      }
    }
    var first = form.querySelector('[name="' + names[0] + '"]');
    if (first && first.focus) first.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submit && submit.disabled) return;
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

    clearInvalid();
    var label = submit ? submit.textContent : '';
    if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
    say('Sending…');

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (res) {
        return res.text().then(function (text) {
          try { return { res: res, body: JSON.parse(text) }; }
          catch (err) {
            return { res: res, body: { error: res.status === 404
              ? 'The contact form is not switched on yet. Please try again later.'
              : 'That did not go through. Please try again in a moment.' } };
          }
        });
      })
      .then(function (r) {
        if (!r.res.ok) {
          say(r.body.error || 'That did not go through. Please try again.', 'error');
          markFields(r.body.fields);
          return;
        }
        say('Thank you — your message is on its way. We read everything and will reply.', 'ok');
        form.reset();
        var grid = form.querySelector('.cx-form__grid') || form;
        if (grid !== form) grid.hidden = true;
        if (submit) submit.hidden = true;
      })
      .catch(function () {
        say('We could not reach the server. Check your connection and try again.', 'error');
      })
      .then(function () {
        if (submit && !submit.hidden) { submit.disabled = false; submit.textContent = label; }
      });
  });
})();
