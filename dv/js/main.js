/**
 * DRAMA.OS • PARALLAX PORTFOLIO CORE ENGINE
 * Interactive 3D Parallax, Canvas Constellations,
 * and Forensic Dossier Modals for Daksh K. Gupta.
 */

(function () {
  'use strict';

  // ==================== PROFILE DATA ====================
  const DAKSH_PROFILE = {
    name: 'Daksh K. Gupta',
    nickname: 'Stupid',
    tagline: 'Navigating university exams on 2 hours of sleep, suffering 4 simultaneous romantic delusions, and holding a master\'s degree in reading into single punctuation marks.',
    role: 'Full-Time Student & Chief Overthinker',
    gpa: '2.14',
    quote: '"I am one polite smile away from writing a 300-page screenplay about our future."',
    crushes: [
      { id: 1, name: 'Target #1: "The Friend\'s Sister"', arch: 'The 6th Grade Code Violation' },
      { id: 2, name: 'Target #2: "The One Who Left"', arch: 'The 7th Grade Phantom Transfer' },
      { id: 3, name: 'Target #3: "The Savage Realist"', arch: '\'Ugly, Dumb, & Not Friends\'' },
      { id: 4, name: 'Target #4: "The Supposed Crush"', arch: 'Crushing on His Friend (Maybe)' }
    ]
  };

  // Safe audio no-op since Audio FX has been removed
  function playTone() {}

  // ==================== DOM READY INITIALIZATION ====================
  document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initStarfieldCanvas();
    initScrollParallax();
    initCard3DTilt();
    initMetricCounters();
    initCrushFilters();
    initSosTerminal();
    initEasterEggs();
    initNav();
    applyProfileToDOM();
  });

  // ==================== 1. GLOWING CURSOR FOLLOWER ====================
  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    const dot = document.getElementById('cursor-dot');
    if (!glow || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderGlow() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(renderGlow);
    }
    requestAnimationFrame(renderGlow);

    // Expand on hoverable elements
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .tilt-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
    });
  }

  // ==================== 2. INTERACTIVE CANVAS STARFIELD ====================
  function initStarfieldCanvas() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 10000), 120);

    let mouse = { x: width / 2, y: height / 2, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.7 + 0.3,
          color: Math.random() > 0.4 ? '#a855f7' : (Math.random() > 0.5 ? '#38bdf8' : '#ec4899')
        });
      }
    }
    createParticles();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse avoidance/drift
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#a855f7';
            ctx.globalAlpha = (1 - dist2 / 85) * 0.18;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // ==================== 3. SCROLL PARALLAX ENGINE ====================
  function initScrollParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
            const yPos = scrollY * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==================== 4. 3D CARD TILT ON MOUSEMOVE ====================
  function initCard3DTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (window.matchMedia('(pointer: coarse)').matches) return;

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  // ==================== 5. METRIC COUNT-UP ANIMATION ====================
  function initMetricCounters() {
    const counters = document.querySelectorAll('.count-up');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target')) || 0;
            const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
            const duration = 1800;
            const startTime = performance.now();

            function updateCount(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = target * easeProgress;
              
              counter.textContent = currentVal.toFixed(decimals);

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = target.toFixed(decimals);
              }
            }
            requestAnimationFrame(updateCount);
          });
        }
      });
    }, { threshold: 0.2 });

    const metricsSection = document.querySelector('.hero-metrics-grid');
    if (metricsSection) observer.observe(metricsSection);
  }

  // ==================== 6. THE 4 CRUSHES FILTER ====================
  function initCrushFilters() {
    const filterButtons = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.crush-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }



  function applyProfileToDOM() {
    const heroName = document.getElementById('hero-name');
    const heroTagline = document.getElementById('hero-tagline');
    const avatarCaptionName = document.getElementById('hero-avatar-caption-name');
    const avatarCaptionDesc = document.getElementById('hero-avatar-caption-desc');

    if (heroName) heroName.textContent = `${DAKSH_PROFILE.name} "${DAKSH_PROFILE.nickname}"`;
    if (heroTagline) heroTagline.textContent = DAKSH_PROFILE.tagline;
    if (avatarCaptionName) avatarCaptionName.textContent = DAKSH_PROFILE.name;
    if (avatarCaptionDesc) avatarCaptionDesc.textContent = DAKSH_PROFILE.quote;

    DAKSH_PROFILE.crushes.forEach(c => {
      const el = document.getElementById(`crush-${c.id}-name`);
      if (el) el.textContent = c.name;
    });
  }

  // ==================== 8. S.O.S CONFESSION TERMINAL ====================
  function initSosTerminal() {
    const form = document.getElementById('sos-form');
    const randomBtn = document.getElementById('btn-random-advice');
    const outputBox = document.getElementById('terminal-output');
    const outputText = document.getElementById('output-text');
    if (!form || !outputBox) return;

    const RANDOM_REALITY_CHECKS = [
      "BROTHER. She didn't reply because she was literally asleep, not because she decoded your childhood trauma from your story view.",
      "Your GPA is currently in intensive care. Close her Instagram profile and open Canvas immediately.",
      "Sending a double-text at 02:43 AM with 'haha anyway you up?' has a historical success rate of exactly 0.00%.",
      "She called you 'bro' 14 times during lunch. She is not playing hard to get; she thinks you share DNA.",
      "You are analyzing the difference between 'haha' and 'haha :)' as if you're the NSA. Go drink water.",
      "The chemistry lab report is due in 3 hours. Handing in a poem about her smile will result in academic probation."
    ];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = document.getElementById('sender-name').value;
      const type = document.getElementById('message-type').value;

      outputBox.style.display = 'block';
      outputText.innerHTML = `
        <strong>TRANSMISSION LOGGED FROM:</strong> [${sender}]<br>
        <strong>PROTOCOL TYPE:</strong> ${type.toUpperCase()}<br><br>
        <em>"Intervention received. Daksh's emergency protocol has dispatched this reality check directly to his notifications. Chances of him actually listening: 12%."</em>
      `;
      form.reset();
    });

    randomBtn.addEventListener('click', () => {
      const random = RANDOM_REALITY_CHECKS[Math.floor(Math.random() * RANDOM_REALITY_CHECKS.length)];
      outputBox.style.display = 'block';
      outputText.innerHTML = `
        <strong>SIMULATED REALITY CHECK DISPATCH:</strong><br>
        ${random}
      `;
    });
  }

  // ==================== 9. EASTER EGGS ====================
  function initEasterEggs() {
    const easterBtn = document.getElementById('btn-quote-easter');
    const easterDisplay = document.getElementById('easter-quote-display');
    const yearSpan = document.getElementById('current-year');

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const QUOTES = [
      "\"The first step to recovery is admitting you re-read that text 80 times.\"",
      "\"I don't need sleep, I need answers to why she used a lowercase 'k'.\"",
      "\"My study method is opening a textbook, sighing deeply, and opening TikTok for 4 hours.\"",
      "\"If falling for people who don't know I exist was a major, I'd have a PhD.\"",
      "\"Due tomorrow? Do tomorrow.\"",
      "\"My love life is like my Wi-Fi: constantly disconnecting and seeking signal in the dark.\""
    ];

    if (easterBtn && easterDisplay) {
      easterBtn.addEventListener('click', () => {
        const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        easterDisplay.style.opacity = '0';
        setTimeout(() => {
          easterDisplay.textContent = quote;
          easterDisplay.style.opacity = '1';
        }, 150);
      });
    }
  }

  // ==================== 10. NAVIGATION ====================
  function initNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('open');
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

})();
