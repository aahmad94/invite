/* ============================================================
   rsvp.js — RSVP form validation & submission
   ============================================================ */

// Paste your deployed Apps Script Web App URL here
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
// Must match the SECRET value in your Apps Script
const SUBMIT_SECRET   = 'barat2026';

// Inject shake keyframe once
const _style = document.createElement('style');
_style.textContent = `
@keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
}`;
document.head.appendChild(_style);

function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // force reflow
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

function showThanks(form, rsvpTy) {
    form.style.transition = 'opacity 0.5s';
    form.style.opacity    = '0';
    setTimeout(() => {
        form.classList.add('hidden');
        rsvpTy.classList.remove('hidden');
    }, 500);
}

export function initRSVP() {
    const form   = document.getElementById('rsvp-form');
    const rsvpTy = document.getElementById('rsvp-thanks');

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name    = form.querySelector('[name="name"]').value.trim();
        const attend  = form.querySelector('[name="attend"]:checked');

        if (!name)   { shake(form.querySelector('[name="name"]').closest('.field')); return; }
        if (!attend) { shake(form.querySelector('.radio-group')); return; }

        const btn = form.querySelector('.btn-confirm');
        btn.classList.add('sent');
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Sending…';

        const payload = {
            secret:  SUBMIT_SECRET,
            name,
            email:   form.querySelector('[name="email"]').value.trim(),
            attend:  attend.value,
            message: form.querySelector('[name="message"]').value.trim(),
        };

        try {
            await fetch(APPS_SCRIPT_URL, {
                method:  'POST',
                // Apps Script requires text/plain to avoid CORS preflight
                headers: { 'Content-Type': 'text/plain' },
                body:    JSON.stringify(payload),
            });
        } catch (_) {
            // Network errors are non-fatal — show thanks anyway so the user
            // isn't left hanging; you can add retry logic here if needed
        }

        btn.querySelector('.btn-text').textContent = 'Sent!';
        setTimeout(() => showThanks(form, rsvpTy), 700);
    });
}
