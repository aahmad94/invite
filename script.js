/* ============================================================
   script.js — Entry point
   Imports feature modules and wires up initialisation order.
   ============================================================ */

import { initSplash }                              from './js/splash.js';
import { setupScratchListeners,
         initScratchCanvases,
         scheduleAutoReveal }                      from './js/scratch.js';
import { startCountdown }                          from './js/countdown.js';
import { initRSVP }                                from './js/rsvp.js';
// scroll-reveal is triggered internally by scratch.js after all cards are revealed

document.addEventListener('DOMContentLoaded', () => {

    // Wire up scratch card events immediately (elements exist in DOM)
    setupScratchListeners();

    // RSVP form lives in gated content but is safe to bind early
    initRSVP();

    // Splash dismiss kicks off everything that needs a visible layout
    initSplash(() => {
        setTimeout(initScratchCanvases, 80); // wait for main to be painted
        scheduleAutoReveal();
        startCountdown();
    });

});
