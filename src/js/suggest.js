/* Suggest a fly — send the form to Ken and Audrey.
 *
 * This used to compose a mailto:, which meant the inbox had to be printed on
 * the page for the link to point at. That is exactly what address harvesters
 * read, and it is why the spam started. It now posts to /api/contact, which
 * knows the address and never renders it.
 *
 * The composed text and its copy button stay. A mailto: silently failed for
 * webmail users, locked-down machines and phones with no mail account, and the
 * same people are the ones most likely to hit a network error here — so they
 * keep a copy of what they wrote either way.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-suggest]');
  if (!form) return;

  var ENDPOINT = '/api/contact';

  var out = document.createElement('div');
  out.className = 'suggest__out';
  out.hidden = true;
  out.setAttribute('role', 'status');
  out.setAttribute('aria-live', 'polite');
  form.insertAdjacentElement('afterend', out);

  function val(name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : '';
  }

  function compose() {
    var fly = val('fly');
    var lines = ['Fly: ' + fly, '', 'Why it belongs:', val('why')];
    var water = val('water');
    var who = val('name');
    if (water) lines.push('', 'Where I fish it: ' + water);
    if (who) lines.push('', 'From: ' + who);
    /* Where it came from, using the address actually being served — the real
       domain is not bought yet and this site currently lives elsewhere. */
    lines.push('', 'Sent from the suggestion form at ' +
      window.location.host + window.location.pathname);
    return { subject: 'Fly suggestion for Volume 2: ' + fly, body: lines.join('\n') };
  }

  function render(msg) {
    out.innerHTML = '';

    var h = document.createElement('p');
    h.className = 'suggest__out-title';
    h.textContent = 'Sending your suggestion…';
    out.appendChild(h);

    var p = document.createElement('p');
    p.className = 'help';
    p.textContent = 'Your mail app should have opened with this in it. If it did not, ' +
      'copy the message below and send it to ' + TO + ' — that is the same inbox.';
    out.appendChild(p);

    var pre = document.createElement('pre');
    pre.className = 'suggest__preview';
    pre.tabIndex = 0;
    pre.textContent = 'To: ' + TO + '\nSubject: ' + msg.subject + '\n\n' + msg.body;
    out.appendChild(pre);

    var row = document.createElement('p');
    row.className = 'cluster';
    row.style.setProperty('--gap', 'var(--s-3)');

    var copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn btn--ghost btn--sm';
    copy.textContent = 'Copy the message';
    copy.addEventListener('click', function () {
      var text = pre.textContent;
      var done = function (ok) {
        copy.textContent = ok ? 'Copied' : 'Press ⌘C to copy';
        window.setTimeout(function () { copy.textContent = 'Copy the message'; }, 2500);
      };
      /* navigator.clipboard is undefined on http:// and in older Safari, so
         selecting the text is the fallback rather than a dead button. */
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { select(); done(false); });
      } else {
        select();
        done(false);
      }
      function select() {
        try {
          var r = document.createRange();
          r.selectNodeContents(pre);
          var s = window.getSelection();
          s.removeAllRanges();
          s.addRange(r);
          pre.focus();
        } catch (e) { /* selection is a nicety, not a requirement */ }
      }
    });
    row.appendChild(copy);

    out.appendChild(row);
    out.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* Let the browser show its own validation bubbles first. */
    if (form.checkValidity && !form.checkValidity()) {
      if (form.reportValidity) form.reportValidity();
      return;
    }

    var msg = compose();
    render(msg);
    out.scrollIntoView({ block: 'nearest' });

    var fd = new FormData();
    fd.append('topic', 'suggestion');
    fd.append('name', val('name') || 'Anonymous');
    fd.append('email', val('email'));
    fd.append('message', msg.subject + '\n\n' + msg.body);

    var note = out.querySelector('.suggest__out-title');
    fetch(ENDPOINT, { method: 'POST', body: fd })
      .then(function (res) { return res.ok; })
      .catch(function () { return false; })
      .then(function (sent) {
        if (!note) return;
        /* The composed text stays on the page either way, so a failure here
           costs the reader their wording — not their work. */
        note.textContent = sent
          ? 'Sent — thank you. Here is what went to them:'
          : 'That did not send. Copy the message below and use the contact form.';
      });
  });
})();
