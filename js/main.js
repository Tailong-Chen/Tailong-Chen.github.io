// ========================================
// Theme Toggle (Dark / Light)
// ========================================
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const html = document.documentElement;

    // Check saved preference or system
    const saved = localStorage.getItem('theme');
    if (saved) {
        html.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
    }
    updateIcon();

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon();
        // Redraw canvases with new theme colors
        drawMoleculeCanvas();
        drawPSFCanvas();
    });

    function updateIcon() {
        const theme = html.getAttribute('data-theme');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ========================================
// Header Scroll Effect
// ========================================
function initHeader() {
    const header = document.getElementById('topHeader');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

// ========================================
// Active Nav Link on Scroll
// ========================================
function initActiveNav() {
    const links = document.querySelectorAll('.top-nav-link');
    const sections = document.querySelectorAll('.content-section, .hero-banner');

    function update() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const overlay = document.getElementById('mobileOverlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    toggle.addEventListener('click', () => {
        const isActive = overlay.classList.toggle('active');
        toggle.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========================================
// Back to Top
// ========================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Scroll Reveal Animations
// ========================================
function initReveal() {
    const items = document.querySelectorAll(
        '.r-card, .pub-entry, .proj-card, .proj-card-sm, .tool-item, .cv-item, .c-card, .skill-group'
    );
    items.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger animation
                const delay = Array.from(entry.target.parentElement.children)
                    .indexOf(entry.target) * 60;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
}

// ========================================
// Skill Bars Animation
// ========================================
function initSkillBars() {
    const fills = document.querySelectorAll('.sbar-fill');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    fills.forEach(f => observer.observe(f));
}

// ========================================
// News Ticker - Clone for infinite scroll
// ========================================
function initTicker() {
    const track = document.getElementById('tickerItems');
    if (!track) return;
    // Clone items for seamless loop
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
}

// ========================================
// Molecule Canvas Animation (Sidebar avatar)
// ========================================
function drawMoleculeCanvas() {
    const canvas = document.getElementById('moleculeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = 65;

    // Get theme colors
    const style = getComputedStyle(document.documentElement);
    const moleculeColor = style.getPropertyValue('--canvas-molecule').trim() || 'rgba(37,99,235,0.6)';
    const bondColor = style.getPropertyValue('--canvas-bond').trim() || 'rgba(37,99,235,0.15)';

    // Molecule positions around the avatar
    const molecules = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        molecules.push({
            angle,
            radius: R + 5 + Math.random() * 8,
            size: 2 + Math.random() * 2.5,
            speed: 0.003 + Math.random() * 0.004,
            offset: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.02
        });
    }

    let frame = 0;

    function animate() {
        ctx.clearRect(0, 0, W, H);
        frame++;

        // Draw bonds between nearby molecules
        for (let i = 0; i < molecules.length; i++) {
            const mi = molecules[i];
            const xi = cx + Math.cos(mi.angle + frame * mi.speed) * mi.radius;
            const yi = cy + Math.sin(mi.angle + frame * mi.speed) * mi.radius;

            for (let j = i + 1; j < molecules.length; j++) {
                const mj = molecules[j];
                const xj = cx + Math.cos(mj.angle + frame * mj.speed) * mj.radius;
                const yj = cy + Math.sin(mj.angle + frame * mj.speed) * mj.radius;
                const dist = Math.hypot(xi - xj, yi - yj);

                if (dist < 80) {
                    ctx.beginPath();
                    ctx.moveTo(xi, yi);
                    ctx.lineTo(xj, yj);
                    ctx.strokeStyle = bondColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw molecules
        molecules.forEach(m => {
            const x = cx + Math.cos(m.angle + frame * m.speed) * m.radius;
            const y = cy + Math.sin(m.angle + frame * m.speed) * m.radius;
            const pulse = 1 + 0.3 * Math.sin(frame * m.pulseSpeed + m.offset);
            const s = m.size * pulse;

            // Glow
            ctx.beginPath();
            ctx.arc(x, y, s * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = bondColor;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fillStyle = moleculeColor;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ========================================
// PSF Canvas (Hero visual)
// ========================================
function drawPSFCanvas() {
    const canvas = document.getElementById('psfCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const style = getComputedStyle(document.documentElement);
    const centerColor = style.getPropertyValue('--psf-center').trim();
    const ringColor = style.getPropertyValue('--psf-ring').trim();

    let frame = 0;

    function drawAiryPattern() {
        ctx.clearRect(0, 0, W, H);
        frame++;

        // Background grid (subtle)
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 0.5;
        const gridSize = 20;
        for (let x = 0; x < W; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // Draw Airy-like rings
        const maxR = 100;
        const rings = 6;
        for (let i = rings; i >= 0; i--) {
            const r = (i / rings) * maxR;
            const breathe = 1 + 0.03 * Math.sin(frame * 0.02 + i * 0.5);
            const actualR = r * breathe;

            // Intensity falls off like Airy pattern
            const intensity = i === 0 ? 0.9 : Math.max(0.03, 0.25 / (i * 0.8));

            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, actualR + 15);
            gradient.addColorStop(0, `rgba(37, 99, 235, ${intensity})`);
            gradient.addColorStop(1, `rgba(37, 99, 235, 0)`);

            ctx.beginPath();
            ctx.arc(cx, cy, actualR + 15, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Ring outline
            if (i > 0 && i < rings) {
                ctx.beginPath();
                ctx.arc(cx, cy, actualR, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 + 0.05 * Math.sin(frame * 0.015 + i)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // Central bright peak
        const peakGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
        peakGlow.addColorStop(0, centerColor);
        peakGlow.addColorStop(0.5, 'rgba(37, 99, 235, 0.3)');
        peakGlow.addColorStop(1, 'rgba(37, 99, 235, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fillStyle = peakGlow;
        ctx.fill();

        // Scattered photon dots
        const numPhotons = 30;
        for (let i = 0; i < numPhotons; i++) {
            const angle = (frame * 0.01 + i * 1.37) % (Math.PI * 2);
            const dist = 10 + (i * 3.7 + frame * 0.3) % maxR;
            // Gaussian-ish probability
            const prob = Math.exp(-(dist * dist) / (2 * 30 * 30));
            if (Math.random() < prob * 0.6 || dist < 25) {
                const px = cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 8;
                const py = cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 8;
                const alpha = 0.3 + prob * 0.5;
                const sz = 1 + prob * 2;

                ctx.beginPath();
                ctx.arc(px, py, sz, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
                ctx.fill();
            }
        }

        // Labels
        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.fillStyle = style.getPropertyValue('--text-muted').trim() || '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('Point Spread Function', cx, H - 16);
        ctx.fillText('Airy Pattern Simulation', cx, H - 4);

        // Axis labels
        ctx.font = '400 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('x [nm]', W - 42, H - 16);
        ctx.save();
        ctx.translate(12, cy + 20);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('y [nm]', 0, 0);
        ctx.restore();

        requestAnimationFrame(drawAiryPattern);
    }

    drawAiryPattern();
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initActiveNav();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initReveal();
    initSkillBars();
    initTicker();
    drawMoleculeCanvas();
    drawPSFCanvas();
});
