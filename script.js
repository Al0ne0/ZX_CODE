/* ═══════════════════════════════════════════════
   ZX CODE — JavaScript Interactions
   ═══════════════════════════════════════════════ */

'use strict';

// ── Cursor Glow ──────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ── Navbar scroll effect ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile nav toggle ────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Particle System ──────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  const count = 30;
  const colors = ['#6c63ff', '#00d2ff', '#ff6b9d', '#00e98a'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const x    = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const dur  = Math.random() * 8 + 4;
    const del  = Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      left: ${x}%;
      bottom: ${Math.random() * 20}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      --duration: ${dur}s;
      --delay: ${del}s;
    `;
    container.appendChild(particle);
  }
}
createParticles();

// ── Scroll Reveal ────────────────────────────────
function initReveal() {
  const elements = document.querySelectorAll(
    '.feature-card, .adv-card, .spec-card, .custom-feat, ' +
    '.terminal-demo, .theme-card, .spec-note, .adv-icon, ' +
    '.section-header, .hero-badge, .download-inner'
  );

  elements.forEach((el, i) => {
    // stagger by index within a parent group
    const delay = (i % 4) * 80;
    el.classList.add('reveal');
    el.style.transitionDelay = delay + 'ms';
  });

  const customize = document.querySelector('.customize-text');
  const themesWrap = document.querySelector('.themes-showcase');
  if (customize) customize.classList.add('reveal-left');
  if (themesWrap) themesWrap.classList.add('reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
}
initReveal();

// ── Smooth Hero Stats Counter ────────────────────
function animateCounter(el, target, suffix = '') {
  const isNum = !isNaN(parseInt(target));
  if (!isNum) return; // skip non-numeric (e.g. "Android 7+")

  const num = parseInt(target);
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * num) + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(el => {
        const raw = el.textContent.trim();
        if (raw.startsWith('100'))  animateCounter(el, 100, '+');
        else if (raw.startsWith('45')) animateCounter(el, 45, 'MB');
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.getElementById('heroStats');
if (heroStats) statsObserver.observe(heroStats);

// ── Theme Switcher ───────────────────────────────
const themeCards = document.querySelectorAll('.theme-card');
themeCards.forEach(card => {
  card.addEventListener('click', () => {
    themeCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

// ── Terminal Typing Animation ────────────────────
function initTerminalAnimation() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = body.querySelectorAll('.t-line');
  lines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
          }, i * 250);
        });
        termObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const termDemo = document.getElementById('terminalDemo');
  if (termDemo) termObserver.observe(termDemo);
}
initTerminalAnimation();

// ── Feature Card hover glow ──────────────────────
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.feature-card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(108,99,255,0.12), transparent 60%)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.feature-card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at top left, rgba(108,99,255,0.08), transparent 60%)`;
    }
  });
});

// ── APK badge pulse ──────────────────────────────
const apkBadge = document.getElementById('apkBadge');
if (apkBadge) {
  setInterval(() => {
    apkBadge.style.boxShadow = '0 0 60px rgba(108,99,255,0.5), 0 4px 40px rgba(0,0,0,0.5)';
    setTimeout(() => {
      apkBadge.style.boxShadow = '';
    }, 600);
  }, 3000);
}

// ── Active nav link highlight on scroll ──────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinksAll.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-nav');
    }
  });
}, { passive: true });

// ── Smooth button ripple effect ──────────────────
function addRipple(el) {
  el.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
  .nav-link.active-nav { color: #f0f0ff !important; }
  .nav-link.active-nav::after { width: 100% !important; }
`;
document.head.appendChild(style);

document.querySelectorAll('.btn-primary, .btn-download, .btn-nav, .btn-ghost')
  .forEach(addRipple);

// ── Greeting in console ──────────────────────────
console.log(
  '%c ⚡ ZX CODE %c El IDE de Escritorio en tu Bolsillo ',
  'background:#6c63ff;color:#fff;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px 0 0 4px;',
  'background:#0f0f1a;color:#6c63ff;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:0 4px 4px 0;border:1px solid #6c63ff;'
);
console.log('%cMotor Monaco · Android 7+ · arm64-v8a · x86_64', 'color:#9898b8;font-size:11px;');
