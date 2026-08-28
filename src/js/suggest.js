/* Suggest a fly — turn the form into a real email.
 *
 * This site has no backend, and the other forms say so: data-capture writes to
 * localStorage and tells the reader that is all it did. That is honest for a
 * waiting list. It would be a lie here, because a suggestion is only worth
 * making if somebody receives it.
 *
 * So the form composes a message and hands it over two ways: mailto: for anyone
 * with a mail client, and the text itself with a copy button for everyone else
 * — webmail users, locked-down machines, phones with no account configured.
 * A mailto: alone silently fails for all of those.
 *
 * Progressive enhancement: with this file absent the form still submits nowhere,
 * so the markup keeps a plain mailto: address alongside it. Nothing is stored.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-suggest]');
  if (!form) return;

  /* The address lives in data/site.json and is rendered into the fallback link
     below the form. Read it from there rather than repeating it: a second copy
     of a value is exactly how this project once shipped two different prices. */
  var manual = document.querySelector('[data-suggest-manual] a[href^="mailto:"]');
  var TO = manual
    ? manual.getAttribute('href').replace(/^mailto:/, '').split('?')[0]
    : '';
  if (!TO) return;

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
    h.textContent = 'Your email is ready';
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

    var again = document.createElement('a');
    again.className = 'btn btn--quiet btn--sm';
    again.href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(msg.subject) +
      '&body=' + encodeURIComponent(msg.body);
    again.textContent = 'Open my mail app again';
    row.appendChild(again);

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

    /* Some mail clients truncate a very long mailto: body, and the reader can
       always copy instead, so this is the convenience path rather than the
       guaranteed one. */
    try {
      window.location.href = 'mailto:' + TO +
        '?subject=' + encodeURIComponent(msg.subject) +
        '&body=' + encodeURIComponent(msg.body);
    } catch (err) { /* the rendered message is still on the page */ }

    out.scrollIntoView({ block: 'nearest' });
  });
})();
