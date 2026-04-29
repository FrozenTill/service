/* ===================================
   MILOMIR LUKIC — script.js
   JavaScript Magic
   =================================== */

'use strict';

// ===================================
// CUSTOM CURSOR
// ===================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover states
document.querySelectorAll('a, button, .service-card, .tech-item, .testimonial-card, select, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  });
});

// ===================================
// PARTICLES CANVAS
// ===================================
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6
        ? `rgba(255,45,32,${this.opacity})`
        : `rgba(160,160,176,${this.opacity * 0.5})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,45,32,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

// ===================================
// NAVBAR SCROLL
// ===================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
});

// ===================================
// HAMBURGER / MOBILE MENU
// ===================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===================================
// TYPEWRITER
// ===================================
(function typewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'ideje u kod.',
    'probleme u rešenja.',
    'viziju u realnost.',
    'složenost u eleganciju.',
    'podatke u uvide.',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false, pause = false;
  const SPEED_TYPE = 80, SPEED_DELETE = 40, PAUSE_END = 1800, PAUSE_START = 300;

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting && !pause) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { pause = true; setTimeout(() => { pause = false; deleting = true; tick(); }, PAUSE_END); return; }
    } else if (deleting && !pause) {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; pause = true; setTimeout(() => { pause = false; tick(); }, PAUSE_START); return; }
    }
    setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
  }
  setTimeout(tick, 600);
})();

// ===================================
// COUNTER ANIMATION
// ===================================
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

// ===================================
// SCROLL REVEAL (Intersection Observer)
// ===================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Card delay
    if (el.classList.contains('reveal-card')) {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
    } else {
      el.classList.add('visible');
    }

    // Counter trigger
    if (el.classList.contains('hero-stats')) animateCounters();

    // Skill bars
    el.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    revealObserver.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-card, .hero-stats, .about-content'
).forEach(el => revealObserver.observe(el));

// ===================================
// SKILL BAR OBSERVER
// ===================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.about-skills').forEach(el => skillObserver.observe(el));

// ===================================
// SERVICE CARD MOUSE GLOW
// ===================================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.transform = `translate(${x - 90}px, ${y - 90}px)`;
    }
  });
});

// ===================================
// PARALLAX GLOW ON HERO
// ===================================
document.addEventListener('mousemove', (e) => {
  const { innerWidth: W, innerHeight: H } = window;
  const xRatio = (e.clientX / W - 0.5) * 2;
  const yRatio = (e.clientY / H - 0.5) * 2;
  const g1 = document.querySelector('.glow-1');
  const g2 = document.querySelector('.glow-2');
  if (g1) g1.style.transform = `translate(${xRatio * 20}px, ${yRatio * 20}px)`;
  if (g2) g2.style.transform = `translate(${xRatio * -15}px, ${yRatio * -15}px)`;
});

// ===================================
// SMOOTH SCROLL NAV
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ===================================
// BACK TO TOP
// ===================================
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================================
// CONTACT FORM
// ===================================
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (!input || !err) return;
  input.classList.toggle('invalid', show);
  err.classList.toggle('visible', show);
}

function clearErrors() {
  ['name', 'email', 'service', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('invalid');
  });
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
}

// Live clear on input
['name', 'email', 'service', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('invalid');
    const err = document.getElementById(id + 'Err') || document.getElementById('serviceErr') || document.getElementById('msgErr');
    // just remove all
    document.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
    el.classList.remove('invalid');
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  let hasError = false;

  if (!name) { setError('name', 'nameErr', true); hasError = true; }
  if (!validateEmail(email)) { setError('email', 'emailErr', true); hasError = true; }
  if (!service) { setError('service', 'serviceErr', true); hasError = true; }
  if (!message) { setError('message', 'msgErr', true); hasError = true; }

  if (hasError) {
    // Shake animation
    form.style.animation = 'none';
    requestAnimationFrame(() => {
      form.style.animation = 'shake 0.4s ease';
    });
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').hidden = true;
  submitBtn.querySelector('.btn-loader').hidden = false;
  submitBtn.querySelector('.btn-icon').hidden = true;

  // Simulate submission (replace with real fetch)
  await new Promise(r => setTimeout(r, 1600));

  submitBtn.hidden = true;
  formSuccess.hidden = false;
  form.querySelectorAll('input, textarea, select').forEach(el => el.disabled = true);
});

// Inject shake keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  15%{transform:translateX(-6px)}
  30%{transform:translateX(6px)}
  45%{transform:translateX(-4px)}
  60%{transform:translateX(4px)}
  75%{transform:translateX(-2px)}
}`;
document.head.appendChild(styleSheet);

// ===================================
// ACTIVE NAV HIGHLIGHT ON SCROLL
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--text)'
      : '';
  });
}, { passive: true });

// ===================================
// TILT ON SERVICE CARDS (subtle)
// ===================================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    card.style.transition = 'box-shadow 0.1s, border-color 0.35s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ===================================
// GLITCH EFFECT ON LOGO (random)
// ===================================
(function glitchLogo() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  setInterval(() => {
    if (Math.random() > 0.92) {
      logo.style.textShadow = '2px 0 var(--red), -2px 0 rgba(56,189,248,0.5)';
      logo.style.transform = 'skewX(-3deg)';
      setTimeout(() => {
        logo.style.textShadow = '';
        logo.style.transform = '';
      }, 80);
    }
  }, 2000);
})();

// ===================================
// HERO CODE WINDOW — Typing animation
// ===================================
(function animateCodeWindow() {
  const codeEl = document.querySelector('.code-body code');
  if (!codeEl) return;

  const originalHTML = codeEl.innerHTML;
  codeEl.innerHTML = '';
  codeEl.style.opacity = '0';

  setTimeout(() => {
    codeEl.style.opacity = '1';
    codeEl.style.transition = 'opacity 0.3s';
    
    let i = 0;
    const text = originalHTML;
    const total = text.length;

    function type() {
      if (i < total) {
        // Skip ahead for HTML tags to avoid broken rendering
        if (text[i] === '<') {
          const closeIdx = text.indexOf('>', i);
          codeEl.innerHTML = text.slice(0, closeIdx + 1);
          i = closeIdx + 1;
        } else {
          codeEl.innerHTML = text.slice(0, ++i);
        }
        setTimeout(type, 8);
      }
    }
    type();
  }, 800);
})();

// ===================================
// SCROLL PROGRESS BAR
// ===================================
(function scrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(to right, #FF2D20, #FF6B35, #F59E0B);
    z-index: 10000; width: 0%; transition: width 0.1s;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrolled / total) * 100}%`;
  }, { passive: true });
})();

// ===================================
// STAGGER REVEAL for nav links on load
// ===================================
window.addEventListener('load', () => {
  document.querySelectorAll('.nav-links li').forEach((li, i) => {
    li.style.opacity = '0';
    li.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      li.style.transition = 'all 0.5s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateY(0)';
    }, 300 + i * 80);
  });
});

// ===================================
// LAZY INTERSECTION for section borders
// ===================================
const lineBorderObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'scaleX(1)';
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(sec => {
  const line = document.createElement('div');
  line.style.cssText = `
    height: 1px; background: linear-gradient(to right, transparent, rgba(255,45,32,0.2), transparent);
    margin: 0 24px; opacity: 0; transform: scaleX(0.3);
    transition: all 1s ease; transform-origin: center;
  `;
  sec.prepend(line);
  lineBorderObserver.observe(line);
});
