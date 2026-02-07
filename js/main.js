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
        header.classList.toggle('scrolled', window.scrollY > 20);
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
            const top = sec.offsetTop - 120;
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
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger animation based on index in parent
                const children = Array.from(entry.target.parentElement.children);
                const index = children.indexOf(entry.target);
                const delay = index * 50; // 50ms stagger
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

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
                // Small delay for drama
                setTimeout(() => {
                    entry.target.style.width = level + '%';
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    fills.forEach(f => observer.observe(f));
}

// ========================================
// News Ticker - Clone for infinite scroll
// ========================================
function initTicker() {
    const track = document.getElementById('tickerItems');
    if (!track) return;
    // Clone items twice for smoother infinite loop on wide screens
    const clone = track.innerHTML;
    track.innerHTML = clone + clone + clone;
}

// ========================================
// Spotlight Effect for Cards
// ========================================
function initSpotlight() {
    const cards = document.querySelectorAll('.r-card, .proj-card, .proj-card-sm, .pub-entry, .c-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Apply spotlight via CSS variable (needs corresponding CSS)
            // Or just direct style for simplicity here, though CSS var is cleaner
            // We'll use a radial gradient overlay
            
            // Check if we have theme colors
            const style = getComputedStyle(document.documentElement);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const color = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(79, 70, 229, 0.04)';
            
            card.style.background = `radial-gradient(800px circle at ${x}px ${y}px, ${color}, transparent 40%), var(--bg-card)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = ''; // Revert to CSS default
        });
    });
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
    const R = 68;

    // Get theme colors
    const style = getComputedStyle(document.documentElement);
    // Use fallbacks just in case
    const moleculeColor = style.getPropertyValue('--canvas-molecule').trim() || '#4f46e5';
    const bondColor = style.getPropertyValue('--canvas-bond').trim() || 'rgba(79, 70, 229, 0.15)';

    // Molecule positions around the avatar
    const molecules = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        molecules.push({
            baseAngle: angle,
            angle: angle,
            radius: R,
            size: 2 + Math.random() * 2,
            speed: 0.002 + Math.random() * 0.003,
            offset: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.01 + Math.random() * 0.01,
            wobbleRange: 5 + Math.random() * 5
        });
    }

    let frame = 0;

    function animate() {
        ctx.clearRect(0, 0, W, H);
        frame++;

        // Draw bonds
        ctx.beginPath();
        for (let i = 0; i < molecules.length; i++) {
            const m = molecules[i];
            // Update position
            m.angle = m.baseAngle + Math.sin(frame * m.speed + m.offset) * 0.5;
            const r = m.radius + Math.sin(frame * m.wobbleSpeed) * m.wobbleRange;
            
            m.x = cx + Math.cos(m.angle + frame * 0.005) * r;
            m.y = cy + Math.sin(m.angle + frame * 0.005) * r;
        }

        // Draw connections
        for (let i = 0; i < molecules.length; i++) {
            const mi = molecules[i];
            for (let j = i + 1; j < molecules.length; j++) {
                const mj = molecules[j];
                const dist = Math.hypot(mi.x - mj.x, mi.y - mj.y);
                if (dist < 60) {
                    const opacity = 1 - (dist / 60);
                    ctx.beginPath();
                    ctx.moveTo(mi.x, mi.y);
                    ctx.lineTo(mj.x, mj.y);
                    ctx.strokeStyle = bondColor.replace(/[\d.]+\)$/g, `${opacity * 0.4})`); // Hacky opacity adjust
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        molecules.forEach(m => {
            const pulse = 1 + 0.2 * Math.sin(frame * 0.05 + m.offset);
            
            // Glow
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size * 3 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = bondColor;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
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
    const centerColor = style.getPropertyValue('--psf-center').trim() || '#4f46e5';
    const ringColor = style.getPropertyValue('--psf-ring').trim() || 'rgba(79, 70, 229, 0.08)';

    let frame = 0;

    function drawAiryPattern() {
        ctx.clearRect(0, 0, W, H);
        frame++;

        // 1. Grid lines (Perspective or flat? Flat for elegance)
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 0.5;
        const gridSize = 30;
        
        // Animated grid drift
        const drift = (frame * 0.2) % gridSize;
        
        for (let x = -gridSize + drift; x < W; x += gridSize) {
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

        // 2. The Airy Pattern (Simulated 2D Gaussian/Bessel)
        // Draw multiple rings with varying opacity
        const maxR = 90;
        
        // Gradient for the main lobe
        const mainLobe = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
        mainLobe.addColorStop(0, centerColor); // Center
        mainLobe.addColorStop(0.4, centerColor.replace(')', ', 0.6)')); 
        mainLobe.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.globalAlpha = 0.8 + 0.2 * Math.sin(frame * 0.03);
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fillStyle = mainLobe;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Side lobes (Rings)
        const rings = [45, 65, 85];
        rings.forEach((r, i) => {
            const intensity = 0.15 / (i + 1);
            const breathe = Math.sin(frame * 0.02 - i) * 2;
            
            ctx.beginPath();
            ctx.arc(cx, cy, r + breathe, 0, Math.PI * 2);
            ctx.strokeStyle = centerColor; // Use main color but transparent
            ctx.lineWidth = 2;
            ctx.globalAlpha = intensity;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        });

        // 3. Simulated Single Molecule Blinking (Stochastic)
        // Random bright spots appearing and disappearing
        if (Math.random() < 0.1) {
             // Create a transient molecule
        }

        // Draw axis labels
        ctx.fillStyle = style.getPropertyValue('--text-muted').trim();
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText('x [nm]', W - 40, H - 10);
        ctx.fillText('y [nm]', 10, 20);

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
    initSpotlight(); // New spotlight effect
    drawMoleculeCanvas();
    drawPSFCanvas();
});
