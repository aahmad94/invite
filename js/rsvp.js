/* ============================================================
   rsvp.js — RSVP form validation & submission
   ============================================================ */

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

export function initRSVP() {
    const form   = document.getElementById('rsvp-form');
    const rsvpTy = document.getElementById('rsvp-thanks');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name   = form.querySelector('[name="name"]').value.trim();
        const attend = form.querySelector('[name="attend"]:checked');

        if (!name)   { shake(form.querySelector('[name="name"]').closest('.field')); return; }
        if (!attend) { shake(form.querySelector('.radio-group')); return; }

        const btn = form.querySelector('.btn-confirm');
        btn.classList.add('sent');
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Sent!';

        setTimeout(() => {
            form.style.transition = 'opacity 0.5s';
            form.style.opacity    = '0';
            setTimeout(() => {
                form.classList.add('hidden');
                rsvpTy.classList.remove('hidden');
            }, 500);
        }, 700);
    });
}
