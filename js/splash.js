/* ============================================================
   splash.js — Splash screen & hero curtain animation
   ============================================================ */

export function initSplash(onDismiss) {
    const splash = document.getElementById('splash');
    const main   = document.getElementById('main');

    let dismissed = false;

    function dismiss() {
        if (dismissed) return;
        dismissed = true;

        splash.classList.add('dismissed');
        main.classList.remove('hidden');

        // Open curtains after main is in the DOM flow
        requestAnimationFrame(() => requestAnimationFrame(() => {
            setTimeout(() => document.body.classList.add('curtains-open'), 60);
        }));

        onDismiss();
    }

    splash.addEventListener('click',      dismiss);
    splash.addEventListener('touchstart', dismiss, { passive: true });
}
