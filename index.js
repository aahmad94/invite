// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Curtain opening on load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 800);

    // === SCRATCH CARD (exact premium feel from theatre demos) ===
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const reveal = document.getElementById('reveal');

    // Dark metallic scratch layer with subtle texture
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texture lines
    ctx.strokeStyle = 'rgba(100,100,100,0.35)';
    ctx.lineWidth = 2;
    for (let i = 8; i < canvas.height; i += 9) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    let isScratching = false;
    let scratchedPercent = 0;

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
            y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
        };
    }

    function scratch(e) {
        if (!isScratching) return;
        const pos = getPos(e);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 38;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 19, 0, Math.PI * 2);
        ctx.fill();

        // Calculate scratched percentage
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparentPixels = 0;
        for (let i = 3; i < data.data.length; i += 4) {
            if (data.data[i] < 30) transparentPixels++;
        }
        scratchedPercent = (transparentPixels / (canvas.width * canvas.height)) * 100;

        if (scratchedPercent > 62) {
            reveal.classList.add('show');
        }
    }

    // Mouse & touch events
    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', e => { isScratching = true; scratch(e); });
    canvas.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', scratch);

    // Auto-reveal after 9 seconds (theatre demo style)
    setTimeout(() => {
        if (scratchedPercent < 55) reveal.classList.add('show');
    }, 9000);
});