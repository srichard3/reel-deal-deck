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

  var prog     = form.querySelector('[data-ws-prog]');
  var progTrack= form.querySelector('[data-ws-prog-track]');
  var progBar  = form.querySelector('[data-ws-prog-bar]');
  var progStep = form.querySelector('[data-ws-prog-step]');

  /* Shrinking the certificate before it leaves the browser.
     The upload is the slow part of this form by an order of magnitude: a phone
     photo of a permit is routinely 3-8MB and it crosses the wire twice, here
     to Netlify and Netlify to Shopify. Downscaled it is a few hundred KB and
     the wait stops being a wait.

     SHRINK_FLOOR is why this is not applied to everything. Under a megabyte
     the upload is already quick and re-encoding only costs quality on a
     document somebody may need to read, so small files are passed through
     untouched. PDFs are never touched at all — they are usually the smallest
     and the cleanest version of the permit anyway. */
  var SHRINK_FLOOR = 1024 * 1024;   /* leave anything already small alone */
  var SHRINK_EDGE  = 2000;          /* px on the long edge — a permit stays readable */
  var SHRINK_Q     = 0.85;

  function shrinkPermit(f) {
    /* Every bail-out below returns the ORIGINAL file. A slow upload is a bad
       minute; a corrupted or sideways tax document is a bad account. */
    if (!f || f.size <= SHRINK_FLOOR) return Promise.resolve(f);
    if (String(f.type).indexOf('image/') !== 0) return Promise.resolve(f);

    /* createImageBitmap with imageOrientation is required, not preferred.
       Phone photos carry an EXIF rotation tag, and canvas drawImage works on
       raw pixels: without the browser applying that tag first, a portrait
       permit is stored on its side. scripts/photos.mjs solves the same problem
       the same way for the founders' photographs. If the browser cannot do it,
       we do not guess — we send the original. */
    if (typeof createImageBitmap !== 'function' || typeof File !== 'function') {
      return Promise.resolve(f);
    }

    return createImageBitmap(f, { imageOrientation: 'from-image' })
      .then(function (bmp) {
        var scale = Math.min(1, SHRINK_EDGE / Math.max(bmp.width, bmp.height));
        if (scale >= 1) { bmp.close && bmp.close(); return f; }

        var canvas = document.createElement('canvas');
        canvas.width  = Math.round(bmp.width  * scale);
        canvas.height = Math.round(bmp.height * scale);
        var ctx = canvas.getContext('2d');
        if (!ctx) { bmp.close && bmp.close(); return f; }
        ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
        bmp.close && bmp.close();

        return new Promise(function (resolve) {
          canvas.toBlob(function (blob) {
            /* Re-encoding does not always win — a screenshot PNG of a permit
               can come back larger as a JPEG. Keep whichever is smaller. */
            if (!blob || blob.size >= f.size) return resolve(f);
            try {
              resolve(new File([blob], 'permit.jpg', { type: 'image/jpeg' }));
            } catch (e) {
              resolve(f);
            }
          }, 'image/jpeg', SHRINK_Q);
        });
      })
      .catch(function () {
        /* HEIC is the common case here: Safari decodes it, Chrome does not.
           An undecodable image is sent exactly as it arrived, which is what
           the function wants anyway — it stores permits as FILE, never IMAGE,
           so Shopify never tries to decode them either. */
        return f;
      });
  }

  function showProgress(pct, step) {
    if (!prog) return;
    prog.hidden = false;
    if (pct == null) {
      /* Phase two: bytes are gone, Shopify is working, nobody knows for how
         long. Stop claiming a number. */
      prog.classList.add('is-waiting');
      /* Clear the width the upload phase left on the element. An inline style
         beats the stylesheet, so without this the travelling "sliver" is still
         90% of the track and the animation reads as a smear rather than a
         marker. Caught in the browser, not in review. */
      progBar.style.removeProperty('inline-size');
      progTrack.removeAttribute('aria-valuenow');
    } else {
      prog.classList.remove('is-waiting');
      progBar.style.inlineSize = pct + '%';
      progTrack.setAttribute('aria-valuenow', String(Math.round(pct)));
    }
    if (step != null) progStep.textContent = step;
  }

  function hideProgress() {
    if (!prog) return;
    prog.hidden = true;
    prog.classList.remove('is-waiting');
    progBar.style.inlineSize = '0%';
    progStep.textContent = '';
    progTrack.removeAttribute('aria-valuenow');
  }

  function say(msg, kind) {
    status.textContent = msg || '';
    status.className = 'ws-apply__status' + (kind ? ' is-' + kind : '');
  }

  /* A finished application has to LOOK finished. Hiding the fields and
     printing a green line under them leaves the heading and the lede in
     place — both of which are instructions for the thing that was just
     done — so the reader is left on what reads like the form they already
     filled in, wondering why they are still here. Swap the whole page. */
  var head = document.querySelector('[data-ws-head]');
  var lede = document.querySelector('[data-ws-lede]');
  var done = document.querySelector('[data-ws-done]');
  var doneText = document.querySelector('[data-ws-done-text]');
  var doneActions = document.querySelector('[data-ws-done-actions]');
  var doneHelp = document.querySelector('[data-ws-done-help]');
  var back = document.querySelector('[data-ws-back]');

  function finish(opts) {
    if (!done) { say(opts.text, 'ok'); return; }
    if (head) head.textContent = opts.heading;
    if (lede) lede.textContent = opts.lede;
    doneText.textContent = opts.text;
    if (doneActions) doneActions.hidden = !opts.signIn;
    if (doneHelp) doneHelp.hidden = !opts.signIn;
    done.hidden = false;
    form.hidden = true;
    if (back) back.hidden = true;
    /* The confirmation is above where they were looking — the button was at
       the bottom of a long form. Without this they see an apparently blank
       page. */
    if (head && head.scrollIntoView) head.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
    submit.classList.add('is-busy');
    /* Deliberately NOT say(BUSY): the button already reads "Setting up your
       account…" and the step line below carries the phase, so echoing it here
       put the same sentence on screen three times. The step line is the live
       region now, so what gets announced is what is actually happening. */
    say('');
    showProgress(0, 'Preparing your certificate…');

    shrinkPermit(file && file.files ? file.files[0] : null)
      .then(function (permit) {
        var body = new FormData(form);
        if (permit) body.set('permit', permit, permit.name || 'permit');
        return send(body);
      })
      .then(function (r) {
        if (!r.ok) {
          say(r.body.error || 'That did not go through. Please try again.', 'error');
          markFields(r.body.fields);
          return;
        }
        if (r.body.pending) {
          finish({
            heading: 'Application received',
            lede: 'We have your details and your resale certificate.',
            text: 'The two of us read these ourselves, so it will not sit in a queue. '
              + 'We will email you as soon as the account is open.',
            signIn: false,
          });
          return;
        }
        if (r.body.redirect) {
          say('You are set up. Taking you to your order page…', 'ok');
          /* assign, not replace: a reader who lands on the cart and hits back
             should get this page, not a dead end. */
          window.location.assign(r.body.redirect);
          return;
        }
        /* Auto-approval: the account exists and is tagged already, so tell them
           what to DO rather than promising an email. Nothing here sends one —
           that is a Shopify Flow, and a message that promises mail the site
           does not send is how "did that work?" emails start.

           "within a minute" is not padding: the customer segment the trade
           discount reads from indexes a few seconds behind the tag (about
           twelve, measured), so somebody who clicks straight through can
           briefly see retail prices. */
        finish({
          heading: 'Your account is open',
          lede: 'No approval to wait for and no password to choose — the account exists now.',
          text: 'Sign in at the shop with this email and your trade pricing will be showing '
            + 'within a minute.',
          signIn: true,
        });
      })
      .catch(function (err) {
        say(err && err.wsMessage
          ? err.wsMessage
          : 'We could not reach the server. Check your connection and try again.', 'error');
      })
      .then(function () {
        hideProgress();
        submit.classList.remove('is-busy');
        if (!submit.hidden) { submit.disabled = false; submit.textContent = label; }
      });
  });

  /* The POST, as XMLHttpRequest rather than fetch.
     fetch() has no upload-progress event — none, by design — so with fetch the
     page cannot tell the difference between "sending 6MB over a slow uplink"
     and "hung". That is exactly what this form looked like. xhr.upload
     .onprogress is the only way a browser reports bytes sent, so the transport
     is chosen by what it can report, not by what reads better. */
  function send(body) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      var settled = false;
      var slowTimer = null;

      function fail(message) {
        if (settled) return;
        settled = true;
        if (slowTimer) clearTimeout(slowTimer);
        var err = new Error(message);
        err.wsMessage = message;
        reject(err);
      }

      xhr.open('POST', form.action, true);

      /* 90%, not 100%. The last tenth of this bar belongs to the server work
         that follows, so the upload finishing does not look like the whole job
         finishing and then stalling. */
      xhr.upload.onprogress = function (e) {
        if (settled || !e.lengthComputable) return;
        showProgress((e.loaded / e.total) * 90, 'Uploading your certificate…');
      };

      xhr.upload.onload = function () {
        if (settled) return;
        showProgress(null, 'Creating your account…');
        /* The account, the file and the welcome email are six or seven
           sequential calls to Shopify. Past a few seconds a reader starts to
           wonder whether it broke, so say what is happening rather than
           letting a silent bar carry it. */
        slowTimer = setTimeout(function () {
          if (!settled) showProgress(null, 'Almost there — the shop is setting the account up…');
        }, 7000);
      };

      /* A ceiling on the whole request. Without one a stalled upstream leaves
         the reader watching an animation for as long as they are willing to,
         and the function itself has no timeout either. Better to stop and
         offer the email route, which always works. */
      xhr.timeout = 60000;
      xhr.ontimeout = function () {
        fail('That is taking longer than it should. Please email us and we will set the account up by hand.');
      };
      xhr.onerror = function () {
        fail('We could not reach the server. Check your connection and try again.');
      };

      xhr.onload = function () {
        if (settled) return;
        settled = true;
        if (slowTimer) clearTimeout(slowTimer);
        var parsed;
        /* Belt and braces for the one way this can go wrong silently: the page
           is live but the function is not deployed, so /api/wholesale-apply is
           a 404 HTML page and parsing it throws. Without this the reader is
           told their connection failed, which is a lie about their wifi. */
        try {
          parsed = JSON.parse(xhr.responseText);
        } catch (e) {
          parsed = { error: xhr.status === 404
            ? 'Online signup is not switched on yet. Please email us and we will set the account up by hand.'
            : 'That did not go through. Please email us and we will set the account up by hand.' };
        }
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, body: parsed });
      };

      xhr.send(body);
    });
  }
})();
