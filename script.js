/* ============================================================
   Barat Invite — Script
   Adeel & Khadija  •  Encore by Zafar Group  •  Nov 12, 2026
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. SPLASH ────────────────────────────────────── */
    const splash = document.getElementById('splash');
    const main   = document.getElementById('main');
    const body   = document.body;

    function dismissSplash() {
        splash.classList.add('dismissed');
        main.classList.remove('hidden');
        requestAnimationFrame(() => requestAnimationFrame(() => {
            setTimeout(() => body.classList.add('curtains-open'), 60);
        }));
        // Init canvases AFTER main is visible so offsetWidth/Height are real
        setTimeout(initAllScratchCards, 80);
        startCountdown();
    }

    splash.addEventListener('click',     dismissSplash);
    splash.addEventListener('touchstart', dismissSplash, { passive: true });


    /* ── 2. THREE SCRATCH CARDS ───────────────────────── */

    const CARD_DATA = [
        { value: 'Nov',  pipId: 'pip-0' },
        { value: '12',   pipId: 'pip-1' },
        { value: '2026', pipId: 'pip-2' },
    ];

    const cards   = CARD_DATA.map(() => ({ revealed: false, ctx: null }));
    const canvases = Array.from(document.querySelectorAll('.scratch-canvas'));

    function drawLayer(c, cv) {
        const g = c.createLinearGradient(0, 0, cv.width, cv.height);
        g.addColorStop(0,    '#3a2e0a');
        g.addColorStop(0.35, '#6b540e');
        g.addColorStop(0.7,  '#4d3d0b');
        g.addColorStop(1,    '#2a2208');
        c.fillStyle = g;
        c.fillRect(0, 0, cv.width, cv.height);

        // Diagonal sheen lines
        c.save();
        c.strokeStyle = 'rgba(212,175,55,0.15)';
        c.lineWidth = 1;
        for (let i = -cv.height; i < cv.width + cv.height; i += 8) {
            c.beginPath();
            c.moveTo(i, 0);
            c.lineTo(i + cv.height, cv.height);
            c.stroke();
        }
        c.restore();

        // Scratch hint
        c.save();
        c.fillStyle = 'rgba(212,175,55,0.5)';
        c.font = `${cv.height * 0.1}px 'Playfair Display', serif`;
        c.textAlign    = 'center';
        c.textBaseline = 'middle';
        c.fillText('✦', cv.width / 2, cv.height / 2);
        c.restore();
    }

    function initAllScratchCards() {
        canvases.forEach((canvas, idx) => {
            const wrap = canvas.closest('.scratch-card-wrap');
            canvas.width  = wrap.offsetWidth  || 155;
            canvas.height = wrap.offsetHeight || 185;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            cards[idx].ctx = ctx;
            drawLayer(ctx, canvas);
        });

        window.addEventListener('resize', () => {
            canvases.forEach((canvas, idx) => {
                if (cards[idx].revealed) return;
                const wrap    = canvas.closest('.scratch-card-wrap');
                canvas.width  = wrap.offsetWidth  || 155;
                canvas.height = wrap.offsetHeight || 185;
                drawLayer(cards[idx].ctx, canvas);
            });
        });
    }

    canvases.forEach((canvas, idx) => {
        let isScratching = false;

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const src  = e.touches ? e.touches[0] : e;
            return {
                x: (src.clientX - rect.left) * (canvas.width  / rect.width),
                y: (src.clientY - rect.top)  * (canvas.height / rect.height),
            };
        }

        function doScratch(e) {
            if (!isScratching || cards[idx].revealed || !cards[idx].ctx) return;
            e.preventDefault();
            const { x, y } = getPos(e);
            const ctx = cards[idx].ctx;

            ctx.globalCompositeOperation = 'destination-out';
            const r = Math.max(canvas.width * 0.14, 18);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();

            const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let transparent = 0;
            for (let i = 3; i < px.length; i += 48) {
                if (px[i] < 20) transparent++;
            }
            const pct = (transparent / (canvas.width * canvas.height / 12)) * 100;
            if (pct > 52) revealCard(idx);
        }

        canvas.addEventListener('mousedown',  () => { isScratching = true; });
        canvas.addEventListener('mouseup',    () => { isScratching = false; });
        canvas.addEventListener('mouseleave', () => { isScratching = false; });
        canvas.addEventListener('mousemove',  doScratch);

        canvas.addEventListener('touchstart', e => { isScratching = true; doScratch(e); }, { passive: false });
        canvas.addEventListener('touchend',   () => { isScratching = false; });
        canvas.addEventListener('touchmove',  doScratch, { passive: false });

        // Auto-reveal staggered: 12 s, 14 s, 16 s
        setTimeout(() => revealCard(idx), 12000 + idx * 2000);
    });


    /* ── reveal one card ──────────────────────────────── */
    function revealCard(idx) {
        if (cards[idx].revealed) return;
        cards[idx].revealed = true;

        // Fade the canvas layer out
        canvases[idx].style.opacity = '0';
        setTimeout(() => { canvases[idx].style.pointerEvents = 'none'; }, 950);

        // Light up pip
        document.getElementById(CARD_DATA[idx].pipId).classList.add('done');

        // Check if all three done
        if (cards.every(c => c.revealed)) {
            setTimeout(unlockContent, 600);
        }
    }


    /* ── unlock everything below ──────────────────────── */
    function unlockContent() {
        const gate    = document.getElementById('scratch-gate');
        const gated   = document.getElementById('gated-content');
        const section = document.getElementById('reveal-section');

        // Fade the gate hint out
        gate.style.opacity = '0';
        setTimeout(() => { gate.style.display = 'none'; }, 900);

        // Show gated content block and fade it in
        gated.classList.add('unlocked');
        requestAnimationFrame(() => requestAnimationFrame(() => {
            gated.classList.add('fade-in');
        }));

        // Smooth scroll to countdown after the fade
        setTimeout(() => {
            gated.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 750);

        // Kick off scroll-reveal observer for newly visible elements
        initScrollReveal();
    }


    /* ── 3. COUNTDOWN ─────────────────────────────────── */
    const TARGET = new Date('2026-11-12T19:00:00');

    function pad(n) { return String(n).padStart(2, '0'); }

    function startCountdown() {
        function tick() {
            const diff = TARGET - Date.now();
            if (diff <= 0) {
                ['cd-days','cd-hours','cd-min','cd-sec'].forEach(id => {
                    document.getElementById(id).textContent = '00';
                });
                return;
            }
            document.getElementById('cd-days').textContent  = Math.floor(diff / 86400000);
            document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
            document.getElementById('cd-min').textContent   = pad(Math.floor((diff % 3600000)  / 60000));
            document.getElementById('cd-sec').textContent   = pad(Math.floor((diff % 60000)    / 1000));
        }
        tick();
        setInterval(tick, 1000);
    }


    /* ── 4. SCROLL REVEAL ─────────────────────────────── */
    // Called once gated content is unlocked (elements now in DOM flow)
    function initScrollReveal() {
        const targets = document.querySelectorAll('[data-reveal]');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        targets.forEach(el => obs.observe(el));
    }


    /* ── 5. RSVP ──────────────────────────────────────── */
    const form     = document.getElementById('rsvp-form');
    const rsvpTy   = document.getElementById('rsvp-thanks');

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
            form.style.opacity = '0';
            setTimeout(() => {
                form.classList.add('hidden');
                rsvpTy.classList.remove('hidden');
            }, 500);
        }, 700);
    });

    function shake(el) {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = 'shake 0.4s ease';
        el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    }

});

/* Dynamic keyframes */
const _s = document.createElement('style');
_s.textContent = `
@keyframes shake {
    0%,100% { transform:translateX(0); }
    20%,60%  { transform:translateX(-6px); }
    40%,80%  { transform:translateX(6px); }
}`;
document.head.appendChild(_s);
