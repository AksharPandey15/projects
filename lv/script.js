/**
 * Portfolio Engine for Lavish
 * Student at K.R. Mangalam School • Badminton Shuttler
 * Vanilla JavaScript • High Performance • Zero External Dependencies
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  let currentName = 'Lavish';
  let soundEnabled = true;
  let audioCtx = null;

  // -------------------------------------------------------------
  // WEB AUDIO SYNTHESIZER (Native SFX, Zero External MP3s)
  // -------------------------------------------------------------
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { }
  }

  function playUiClick() {
    playTone(600, 'sine', 0.04, 0.04);
  }

  function playKeyClick() {
    playTone(850 + Math.random() * 200, 'triangle', 0.03, 0.02);
  }

  // Realistic synthesized racket snap & smash sound
  function playSmashSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);

      setTimeout(() => playTone(180, 'sine', 0.15, 0.08), 20);
    } catch (e) { }
  }

  function playSuccessChord() {
    if (!soundEnabled) return;
    try {
      setTimeout(() => playTone(523.25, 'triangle', 0.12, 0.06), 0);
      setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.06), 70);
      setTimeout(() => playTone(783.99, 'triangle', 0.20, 0.08), 140);
      setTimeout(() => playTone(1046.50, 'sine', 0.30, 0.1), 210);
    } catch (e) { }
  }

  // -------------------------------------------------------------
  // DYNAMIC NAME REPLACEMENT ENGINE
  // -------------------------------------------------------------
  function updatePortfolioName(name) {
    currentName = name || 'Lavish';
    const cleanName = currentName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'lavish';

    // Update document title
    document.title = `${currentName} — School Student & Badminton Player | K.R. Mangalam`;

    // Update all .name-target elements
    document.querySelectorAll('.name-target').forEach(el => {
      el.textContent = currentName;
    });

    // Update all .name-target-clean elements
    document.querySelectorAll('.name-target-clean').forEach(el => {
      el.textContent = cleanName;
    });

    // Update top banner display
    const bannerName = document.getElementById('banner-name');
    if (bannerName) bannerName.textContent = currentName;

    // Update email links
    document.querySelectorAll('.email-direct-link').forEach(link => {
      link.href = `mailto:${cleanName}.krm@gmail.com`;
      link.textContent = `${cleanName}.krm@gmail.com`;
    });

    // Update form placeholders
    const messageInput = document.getElementById('contact-message');
    if (messageInput) {
      messageInput.placeholder = `Hey ${currentName}, want to play badminton this Friday after school?...`;
    }
  }

  // -------------------------------------------------------------
  // TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    container.appendChild(toast);
    playUiClick();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // -------------------------------------------------------------
  // TYPING HERO ROLE TEXT
  // -------------------------------------------------------------
  function initTypingRole() {
    const el = document.getElementById('role-typing-text');
    if (!el) return;

    const roles = [
      'Badminton Smashes & Court Agility',
      'K.R. Mangalam School Student',
      'Consistent ~70% Marks Club',
      'Fast Reflexes & High Stamina',
      'Great Friend & Doubles Partner'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 75;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = currentRole.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = currentRole.substring(0, charIndex);
      }

      let speed = typingSpeed;
      if (isDeleting) speed /= 2;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 350;
      }

      setTimeout(type, speed);
    }

    type();
  }

  // -------------------------------------------------------------
  // INTERACTIVE BACKGROUND CANVAS (Particle Mesh)
  // -------------------------------------------------------------
  function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: -1000, y: -1000, radius: 130 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.6 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.15
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        let finalAlpha = p.baseAlpha;
        if (mDist < mouse.radius) {
          const force = (1 - mDist / mouse.radius);
          p.x -= (mdx / mDist) * force * 1.5;
          p.y -= (mdy / mDist) * force * 1.5;
          finalAlpha = Math.min(1, p.baseAlpha + 0.5);

          ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * force})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(167, 139, 250, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  // -------------------------------------------------------------
  // INTERACTIVE HACKER TERMINAL SIMULATOR
  // -------------------------------------------------------------
  function initTerminal() {
    const body = document.getElementById('terminal-body');
    const input = document.getElementById('terminal-input');
    const clearBtn = document.getElementById('btn-term-clear');
    const shortcutBtns = document.querySelectorAll('.sc-btn');

    if (!body || !input) return;

    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
      help: () => `
<div class="t-res">
  <strong class="t-res-highlight">Available Commands for Lavish's Shell:</strong><br>
  • <span class="cmd-pill">badminton</span>   : View court weapon, smash speed &amp; tournament profile<br>
  • <span class="cmd-pill">school</span>      : K.R. Mangalam School life &amp; daily schedule<br>
  • <span class="cmd-pill">smash</span>       : Launch an interactive supersonic jump smash<br>
  • <span class="cmd-pill">marks</span>       : Learn the honest ~70% marks philosophy<br>
  • <span class="cmd-pill">whoami</span>      : Quick summary profile<br>
  • <span class="cmd-pill">contact</span>     : How to reach Lavish<br>
  • <span class="cmd-pill">clear</span>       : Clear the terminal window
</div>`,

      whoami: () => `
<div class="t-res">
  Name: <strong class="t-res-highlight">Lavish</strong><br>
  School: <strong class="t-res-highlight">K.R. Mangalam World School</strong><br>
  Role: School Student &amp; Badminton Player<br>
  Academic Standing: <span class="t-res-success">~70% Average (Solid, balanced &amp; stress-free)</span><br>
  Favorite Sport: Badminton (Singles / Doubles Attack)<br>
  Philosophy: "100% effort on the court, honest grades on paper, and genuine friendships."
</div>`,

      badminton: () => `
<div class="t-res">
  <span class="t-res-highlight">[BADMINTON ARSENAL &amp; STATS]</span><br>
  • Primary Racket   : Yonex Astrox (Head-heavy power frame)<br>
  • String Tension   : 26 lbs (Crisp repulsion &amp; control)<br>
  • Smash Speed      : 210+ km/h (Steep jump smash down the line)<br>
  • Preferred Format : Singles &amp; Fast-Paced Doubles<br>
  • Court Coverage   : 6-corner split step recovery<br>
  • Home Court       : K.R. Mangalam School Sports Hall
</div>`,

      school: () => `
<div class="t-res">
  <span class="t-res-highlight">[K.R. MANGALAM SCHOOL LIFE]</span><br>
  • School       : K.R. Mangalam World School<br>
  • Favorite Periods : Physical Education / Badminton<br>
  • Academics    : Consistent ~70% marks (Balanced, relaxed &amp; confident)<br>
  • Recess Vibe  : Great laughs with friends, catching up, and planning afternoon matches
</div>`,

      smash: () => {
        playSmashSound();
        return `
<div class="t-res t-res-success">
  [🏸 JUMP SMASH EXECUTED!] 💥<br>
  =======================================================<br>
  Contact Point : 3.1 meters above ground<br>
  Smash Velocity: 216.4 km/h<br>
  Trajectory    : Steep diagonal skimming the white tape<br>
  Outcome       : Clean winner! Point to Lavish! 🏆<br>
  =======================================================
</div>`;
      },

      marks: () => `
<div class="t-res">
  <span class="t-res-highlight">[THE HONEST ~70% MARKS PHILOSOPHY]</span><br>
  "I don't stress over cramming 16 hours a day just to chase 99%.<br>
  A steady 70% means I understand the core concepts, pass exams<br>
  with ease, and still have energy left to play badminton,<br>
  stay healthy, and enjoy school life." — Lavish
</div>`,

      contact: () => `
<div class="t-res">
  Phone no.: <a href="tel:+919927930678" class="t-res-highlight">+91 99279 30678</a><br>
  School   : K.R. Mangalam World School<br>
</div>`
    };

    function executeCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      commandHistory.push(rawCmd);
      historyIndex = commandHistory.length;

      const entry = document.createElement('div');
      entry.className = 't-command-output';

      const promptLine = document.createElement('div');
      promptLine.className = 't-executed-line';
      promptLine.innerHTML = `<span class="t-prompt-prefix">lavish@krm-school ~ $</span> ${escapeHtml(rawCmd)}`;
      entry.appendChild(promptLine);

      if (cmd === 'clear') {
        body.innerHTML = '';
        input.value = '';
        return;
      }

      let responseHtml = '';
      if (commands[cmd]) {
        responseHtml = commands[cmd]();
      } else {
        responseHtml = `<div class="t-res-error">zsh: command not found: ${escapeHtml(cmd)}. Type <span class="cmd-pill">help</span> for commands.</div>`;
      }

      const resDiv = document.createElement('div');
      resDiv.innerHTML = responseHtml;
      entry.appendChild(resDiv);

      body.appendChild(entry);
      body.scrollTop = body.scrollHeight;

      input.value = '';
      playKeyClick();
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(input.value);
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
        }
      } else {
        playKeyClick();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        body.innerHTML = '';
        playUiClick();
      });
    }

    shortcutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          input.value = cmd;
          executeCommand(cmd);
        }
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // -------------------------------------------------------------
  // CONTACT FORM VALIDATION & DISPATCH
  // -------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageInput = document.getElementById('contact-message');
    const charCurrent = document.getElementById('char-current');
    const submitBtn = document.getElementById('btn-submit-form');
    const submitText = document.getElementById('submit-btn-text');

    if (!form) return;

    if (messageInput && charCurrent) {
      messageInput.addEventListener('input', () => {
        charCurrent.textContent = messageInput.value.length;
        if (messageInput.value.length > 1000) {
          charCurrent.style.color = 'var(--color-danger)';
        } else {
          charCurrent.style.color = 'var(--text-dim)';
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields marked with *', 'error');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        showToast('Please provide a valid email address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitText.textContent = 'Sending message to Lavish...';
      playTone(440, 'triangle', 0.1, 0.05);

      setTimeout(() => {
        submitBtn.disabled = false;
        submitText.innerHTML = `Send Message to <span class="name-target">${currentName}</span>`;
        form.reset();
        if (charCurrent) charCurrent.textContent = '0';

        playSuccessChord();
        showToast(`Message sent to Lavish! He will get back to you soon.`, 'success', 5000);
      }, 1000);
    });

    const coffeeBtn = document.getElementById('btn-coffee-chat');
    if (coffeeBtn) {
      coffeeBtn.addEventListener('click', () => {
        playUiClick();
        showToast(`Court match noted! Lavish is ready at K.R. Mangalam School courts.`, 'info');
      });
    }
  }

  // -------------------------------------------------------------
  // THEME COLOR SWITCHER
  // -------------------------------------------------------------
  function initThemeSwitcher() {
    const dots = document.querySelectorAll('.theme-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        const color = dot.getAttribute('data-color');
        document.documentElement.setAttribute('data-theme', color);
        playUiClick();
        showToast(`Switched theme to ${color.toUpperCase()}`, 'info', 2000);
      });
    });
  }

  // -------------------------------------------------------------
  // SOUND TOGGLE
  // -------------------------------------------------------------
  function initSoundToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    const iconOn = document.getElementById('sound-icon-on');
    const iconOff = document.getElementById('sound-icon-off');
    const soundText = document.getElementById('sound-text');

    if (!btn) return;

    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
        soundText.textContent = 'SFX ON';
        playUiClick();
      } else {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
        soundText.textContent = 'SFX OFF';
      }
    });
  }

  // -------------------------------------------------------------
  // MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-footer a');

    if (!btn || !drawer) return;

    btn.addEventListener('click', () => {
      drawer.classList.toggle('active');
      playUiClick();
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    });
  }

  // -------------------------------------------------------------
  // LIVE CLOCK IN STATUS PILL
  // -------------------------------------------------------------
  function initClock() {
    const clockEl = document.getElementById('local-time-clock');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      const istHours = String((now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30) / 60)) % 24).padStart(2, '0');
      const istMins = String((now.getUTCMinutes() + 30) % 60).padStart(2, '0');
      clockEl.textContent = `${istHours}:${istMins} IST • Greater Noida`;
    }

    update();
    setInterval(update, 10000);
  }

  // -------------------------------------------------------------
  // INITIALIZE EVERYTHING ON DOM READY
  // -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    updatePortfolioName('Lavish');
    initTypingRole();
    initBackgroundCanvas();
    initTerminal();
    initContactForm();
    initThemeSwitcher();
    initSoundToggle();
    initMobileMenu();
    initClock();
  });

})();
