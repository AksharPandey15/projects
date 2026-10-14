/* ==========================================================================
   DIVYANSH K. SWACH - INTERACTIVE PARALLAX PORTFOLIO JAVASCRIPT
   Smooth Parallax, Web Audio Synthesizer, Food Clicker, Physics Bouncer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Web Audio API Synthesizer (Zero External Dependencies)
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playMunch() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    playBoing() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, this.ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.28);
    }

    playLoveChime() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
      });
    }

    playBuzzer() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    }

    playCelebration() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.4);
      });
    }

    playLockClick() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    }
  }

  const sfx = new SoundFX();

  // Sound toggle button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sfx.init();
      sfx.muted = !sfx.muted;
      soundToggleBtn.innerHTML = sfx.muted ? '🔇' : '🔊';
      soundToggleBtn.setAttribute('title', sfx.muted ? 'Unmute Sound FX' : 'Mute Sound FX');
    });
  }

  // 2. Parallax Controller & Scroll Progress
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navbar = document.getElementById('navbar');
  const ambientOrbs = document.querySelectorAll('.orb');
  const floatItems = document.querySelectorAll('.float-item');

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / (maxScroll || 1)) * 100;

    // Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Navbar style on scroll
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Parallax Orbs
    if (ambientOrbs.length > 0) {
      ambientOrbs.forEach((orb, idx) => {
        const speed = (idx + 1) * 0.12;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }

    // Parallax Floating Icons
    if (floatItems.length > 0) {
      floatItems.forEach((item, idx) => {
        const speed = 0.08 + (idx % 4) * 0.04;
        const offset = Math.sin((scrollY * 0.002) + idx) * 15;
        item.style.transform = `translateY(${scrollY * speed * -0.5 + offset}px) rotate(${offset}deg)`;
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // 3. 3D Tilt Effect on Hero Card
  const heroAvatarFrame = document.getElementById('heroAvatarFrame');
  if (heroAvatarFrame) {
    const heroCard = document.querySelector('.hero-visual-card');
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / rect.height) * 18;
      const rotateY = (x / rect.width) * 18;

      heroAvatarFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroAvatarFrame.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 4. Dynamic Typing Subtitle Effect
  const typedTarget = document.getElementById('typedText');
  const roles = [
    'Certified School Bhukkad 🍕',
    'In Love with Satakshi Since 4th Grade 🎒❤️',
    'Aerodynamically Spherical ⚽',
    'Satakshi\'s Eternal Soulmate ❤️',
    'Brain Power: 404 Not Found 🧠',
    'Canteen VIP Guest of Honor 🥪',
    'Legally Resembles a Soccer Ball 🏆'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    if (!typedTarget) return;
    const currentText = roles[roleIdx];

    if (isDeleting) {
      typedTarget.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedTarget.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIdx === currentText.length) {
      typingSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeRole, typingSpeed);
  }
  typeRole();

  // 5. Bhukkad Feeding Minigame
  let caloriesConsumed = 0;
  let chonkPercentage = 25;
  const bellyVisual = document.getElementById('avatarBellyVisual');
  const chonkBarFill = document.getElementById('chonkBarFill');
  const chonkPercentText = document.getElementById('chonkPercentText');
  const chonkStageText = document.getElementById('chonkStageText');
  const bellyQuoteText = document.getElementById('bellyQuoteText');
  const totalCalorieCounter = document.getElementById('totalCalorieCounter');

  const foodQuotes = [
    "Nom nom nom... Satakshi said dieting starts next year! 🍔",
    "Chewing burns calories, so technically I am a fitness athlete! 🍕",
    "My belly is not fat, it is a high-capacity snack storage unit! 🥟",
    "Doctors call it obesity, I call it perfect football sphericity! ⚽",
    "Satakshi likes round things. The Moon, pizza, and ME! 💖",
    "If eating was an Olympic sport, I'd bring home pure gold samosas! 🥇",
    "Canteen uncle already named a burger combo after me! 🍟",
    "Is it my fault samosas fit so comfortably in my hands?! 🤤"
  ];

  const stages = [
    { min: 0, max: 30, name: "Stage 1: Mildly Chubby Schoolboy 🎒", scale: 1.0 },
    { min: 31, max: 55, name: "Stage 2: Official Adidas Match Ball ⚽", scale: 1.15 },
    { min: 56, max: 75, name: "Stage 3: High-Gravity Snorlax 🦛", scale: 1.28 },
    { min: 76, max: 95, name: "Stage 4: Cosmic Food Planet 🪐", scale: 1.42 },
    { min: 96, max: 100, name: "Stage 5: Black Hole of the Canteen 💥", scale: 1.55 }
  ];

  function updateBellyState() {
    if (chonkBarFill) chonkBarFill.style.width = `${chonkPercentage}%`;
    if (chonkPercentText) chonkPercentText.textContent = `${chonkPercentage}%`;

    const currentStage = stages.find(s => chonkPercentage >= s.min && chonkPercentage <= s.max) || stages[0];
    if (chonkStageText) chonkStageText.textContent = currentStage.name;

    if (bellyVisual) {
      bellyVisual.style.transform = `scale(${currentStage.scale})`;
      bellyVisual.classList.add('chewing-active');
      setTimeout(() => bellyVisual.classList.remove('chewing-active'), 600);
    }

    if (totalCalorieCounter) {
      totalCalorieCounter.textContent = (98450 + caloriesConsumed).toLocaleString();
    }
  }

  const foodButtons = document.querySelectorAll('.food-card-btn');
  foodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cal = parseInt(btn.getAttribute('data-cal')) || 250;
      caloriesConsumed += cal;
      chonkPercentage = Math.min(100, chonkPercentage + 5);

      sfx.playMunch();

      // Spawn flying food emoji effect
      const emoji = btn.querySelector('.food-card-emoji')?.textContent || '🍔';
      spawnFloatingFoodEmoji(btn, emoji);

      // Random Quote
      const randomQuote = foodQuotes[Math.floor(Math.random() * foodQuotes.length)];
      if (bellyQuoteText) bellyQuoteText.textContent = randomQuote;

      updateBellyState();
    });
  });

  function spawnFloatingFoodEmoji(sourceElem, emojiChar) {
    const rect = sourceElem.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.className = 'floating-heart-particle';
    particle.textContent = emojiChar;
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top}px`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
  }

  const resetBellyBtn = document.getElementById('resetBellyBtn');
  if (resetBellyBtn) {
    resetBellyBtn.addEventListener('click', () => {
      caloriesConsumed = 0;
      chonkPercentage = 25;
      if (bellyQuoteText) bellyQuoteText.textContent = "Belly cleared! Ready for round 2 at the canteen!";
      updateBellyState();
      sfx.playBoing();
    });
  }

  // 6. Interactive Football Bouncer Launcher ("Roll Divyansh")
  const rollDivyanshBtn = document.getElementById('rollDivyanshBtn');
  if (rollDivyanshBtn) {
    rollDivyanshBtn.addEventListener('click', () => {
      launchBouncingFootball();
    });
  }

  function launchBouncingFootball() {
    sfx.playBoing();
    const ball = document.createElement('div');
    ball.className = 'screen-football-ball';
    ball.textContent = '⚽';
    document.body.appendChild(ball);

    let posX = 0;
    let posY = window.innerHeight - 150;
    let velX = 14 + Math.random() * 8;
    let velY = -18;
    const gravity = 0.9;
    let bounces = 0;

    function animateBall() {
      posX += velX;
      velY += gravity;
      posY += velY;

      // Bounce floor
      if (posY >= window.innerHeight - 90) {
        posY = window.innerHeight - 90;
        velY = -velY * 0.72;
        bounces++;
        if (bounces <= 4) {
          sfx.playBoing();
        }
      }

      ball.style.transform = `translate(${posX}px, ${posY}px) rotate(${posX * 3}deg)`;

      if (posX < window.innerWidth + 100 && bounces < 9) {
        requestAnimationFrame(animateBall);
      } else {
        ball.remove();
      }
    }
    requestAnimationFrame(animateBall);
  }

  // 7. Aerodynamics Slider
  const aeroSlider = document.getElementById('aeroSlider');
  const dragDisplay = document.getElementById('dragDisplay');
  const sphericityDisplay = document.getElementById('sphericityDisplay');
  const kickabilityDisplay = document.getElementById('kickabilityDisplay');

  if (aeroSlider) {
    aeroSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      const sphericity = (90 + (val / 100) * 9.8).toFixed(1);
      const drag = (0.25 - (val / 100) * 0.12).toFixed(2);
      const kickability = (85 + (val / 100) * 15).toFixed(0);

      if (sphericityDisplay) sphericityDisplay.textContent = `${sphericity}%`;
      if (dragDisplay) dragDisplay.textContent = `${drag} Cd`;
      if (kickabilityDisplay) kickabilityDisplay.textContent = `${kickability}%`;
    });
  }

  // 8. Satakshi Heart Particle Spawner
  const spawnHeartsBtn = document.getElementById('spawnHeartsBtn');
  if (spawnHeartsBtn) {
    spawnHeartsBtn.addEventListener('click', () => {
      sfx.playLoveChime();
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const rect = spawnHeartsBtn.getBoundingClientRect();
          const particle = document.createElement('div');
          particle.className = 'floating-heart-particle';
          const hearts = ['❤️', '💖', '💘', '🍕', '🥰', '✨'];
          particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
          particle.style.left = `${rect.left + Math.random() * rect.width}px`;
          particle.style.top = `${rect.top}px`;
          document.body.appendChild(particle);
          setTimeout(() => particle.remove(), 2000);
        }, i * 70);
      }
    });
  }

  // 8b. 4th Grade to Couples Interactive Timeline Step Cards
  const timelineStepCards = document.querySelectorAll('.timeline-step-card');
  timelineStepCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const emojis = [
        ['🎒', '😜', '✏️', '🤣'],
        ['💬', '🍕', '🗣️', '✨'],
        ['🥊', '😈', '🍔', '😆'],
        ['💖', '💍', '💘', '🥰']
      ];
      
      if (idx === 0) sfx.playBoing();
      else if (idx === 1) sfx.playLoveChime();
      else if (idx === 2) sfx.playMunch();
      else sfx.playCelebration();

      // Spawn burst of emojis from card
      const rect = card.getBoundingClientRect();
      const cardEmojis = emojis[idx] || ['💖'];
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.className = 'floating-heart-particle';
          particle.textContent = cardEmojis[Math.floor(Math.random() * cardEmojis.length)];
          particle.style.left = `${rect.left + Math.random() * rect.width}px`;
          particle.style.top = `${rect.top}px`;
          document.body.appendChild(particle);
          setTimeout(() => particle.remove(), 2000);
        }, i * 60);
      }
    });
  });

  // 9. IQ Quiz Diagnostics
  const quizOptionBtns = document.querySelectorAll('.quiz-option-btn');
  const quizScoreDisplay = document.getElementById('quizIqResult');
  const quizTitleDisplay = document.getElementById('quizTitleResult');

  quizOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentList = btn.closest('.quiz-options-list');
      parentList.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected', 'divyansh-choice'));
      btn.classList.add('selected');

      const isDivyanshChoice = btn.getAttribute('data-divyansh') === 'true';
      if (isDivyanshChoice) {
        btn.classList.add('divyansh-choice');
        sfx.playBuzzer();
      } else {
        sfx.playBoing();
      }

      calculateQuizScore();
    });
  });

  function calculateQuizScore() {
    const selectedDivyansh = document.querySelectorAll('.quiz-option-btn.divyansh-choice').length;
    let iq = -4.2;
    let title = "Stupid & Idiot Combo";

    if (selectedDivyansh === 3) {
      iq = -42.0;
      title = "Maximum Idiocy (100% Divyansh)";
    } else if (selectedDivyansh === 2) {
      iq = -15.5;
      title = "Severe Brain Lag";
    } else if (selectedDivyansh === 1) {
      iq = 10.0;
      title = "Accidental Smartness";
    } else {
      iq = 20.0;
      title = "Suspected Imposter (Not Divyansh)";
    }

    if (quizScoreDisplay) quizScoreDisplay.textContent = `${iq}`;
    if (quizTitleDisplay) quizTitleDisplay.textContent = title;
  }

  // 10. Snack Delivery Contact Form with Confetti
  const snackForm = document.getElementById('snackOrderForm');
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

  if (snackForm) {
    snackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sfx.playCelebration();
      runConfettiExplosion();

      const snackName = document.getElementById('snackSelect')?.value || 'Giant Cheesy Pizza';
      alert(`🎉 SNACK DELIVERED! Divyansh has successfully inhaled the "${snackName}". He gives you his blessing and promises to introduce you to Satakshi!`);
      snackForm.reset();
    });
  }

  // Canvas Confetti
  function runConfettiExplosion() {
    if (!confettiCanvas || !confettiCtx) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ffb703', '#fb8500', '#ff0054', '#00f0ff', '#06d6a0', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 22,
        velY: (Math.random() - 0.5) * 22 - 6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }

    let frame = 0;
    function renderConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      pieces.forEach(p => {
        p.x += p.velX;
        p.y += p.velY;
        p.velY += 0.4; // gravity
        p.rotation += p.rotSpeed;

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
      });

      frame++;
      if (frame < 120) {
        requestAnimationFrame(renderConfetti);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }
    requestAnimationFrame(renderConfetti);
  }

  // 11. Modal System for Trophy & Certificate
  const viewTrophyBtn = document.getElementById('viewTrophyBtn');
  const certificateModal = document.getElementById('certificateModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (viewTrophyBtn && certificateModal) {
    viewTrophyBtn.addEventListener('click', () => {
      certificateModal.classList.add('active');
      sfx.playCelebration();
    });
  }

  if (modalCloseBtn && certificateModal) {
    modalCloseBtn.addEventListener('click', () => {
      certificateModal.classList.remove('active');
    });
  }

  if (certificateModal) {
    certificateModal.addEventListener('click', (e) => {
      if (e.target === certificateModal) {
        certificateModal.classList.remove('active');
      }
    });
  }

  // 12. Security Password Gatekeeper Controller
  const securityGateOverlay = document.getElementById('securityGateOverlay');
  const securityGateCard = document.getElementById('securityGateCard');
  const securityGateForm = document.getElementById('securityGateForm');
  const gatePasswordInput = document.getElementById('gatePasswordInput');
  const gateInputWrapper = document.getElementById('gateInputWrapper');
  const gateToggleVisibility = document.getElementById('gateToggleVisibility');
  const gateEyeIcon = document.getElementById('gateEyeIcon');
  const gateFeedback = document.getElementById('gateFeedback');
  const gateSubmitBtn = document.getElementById('gateSubmitBtn');
  const gateBtnIcon = document.getElementById('gateBtnIcon');
  const gateBtnLabel = document.getElementById('gateBtnLabel');
  const gateAvatar = document.getElementById('gateAvatar');
  const gateAvatarIcon = document.getElementById('gateAvatarIcon');
  const lockSiteBtn = document.getElementById('lockSiteBtn');

  const CORRECT_PASSPHRASE = 'football';
  let isUnlocking = false;

  // Auto-focus input when gate is active
  if (gatePasswordInput) {
    setTimeout(() => {
      gatePasswordInput.focus();
    }, 200);
  }

  // Toggle Password Visibility
  if (gateToggleVisibility && gatePasswordInput) {
    gateToggleVisibility.addEventListener('click', () => {
      const isPassword = gatePasswordInput.type === 'password';
      gatePasswordInput.type = isPassword ? 'text' : 'password';
      if (gateEyeIcon) {
        gateEyeIcon.textContent = isPassword ? '🙈' : '👁️';
      }
      gateToggleVisibility.setAttribute(
        'title',
        isPassword ? 'Hide password' : 'Show password'
      );
    });
  }

  // Function to unlock the site
  function unlockWebsite() {
    if (isUnlocking) return;
    isUnlocking = true;

    // Feedback & UI State
    if (gateFeedback) {
      gateFeedback.textContent = '✅ Access Clearance Granted! Unlocking...';
      gateFeedback.className = 'gate-feedback feedback-success';
    }
    if (gateInputWrapper) {
      gateInputWrapper.className = 'gate-input-wrapper is-valid';
    }
    if (gateAvatar) {
      gateAvatar.classList.remove('error-state');
      gateAvatar.classList.add('success-state');
    }
    if (gateAvatarIcon) {
      gateAvatarIcon.textContent = '🔓';
    }
    if (gateBtnIcon) {
      gateBtnIcon.textContent = '✨';
    }
    if (gateBtnLabel) {
      gateBtnLabel.textContent = 'Welcome, Agent!';
    }
    if (gatePasswordInput) {
      gatePasswordInput.disabled = true;
    }
    if (gateSubmitBtn) {
      gateSubmitBtn.disabled = true;
    }

    // Audio & Confetti
    sfx.playCelebration();
    runConfettiExplosion();

    // Smooth dismiss animation
    setTimeout(() => {
      if (securityGateOverlay) {
        securityGateOverlay.classList.add('gate-unlocked');
      }
      document.body.classList.remove('site-locked');
      isUnlocking = false;
    }, 600);
  }

  // Function to reject incorrect password
  function rejectPassword() {
    sfx.playBuzzer();

    if (securityGateCard) {
      securityGateCard.classList.remove('shake-card');
      // Trigger reflow to restart animation
      void securityGateCard.offsetWidth;
      securityGateCard.classList.add('shake-card');
      setTimeout(() => {
        securityGateCard.classList.remove('shake-card');
      }, 500);
    }

    if (gateInputWrapper) {
      gateInputWrapper.className = 'gate-input-wrapper is-invalid';
    }

    if (gateAvatar) {
      gateAvatar.classList.remove('success-state');
      gateAvatar.classList.add('error-state');
      if (gateAvatarIcon) {
        gateAvatarIcon.textContent = '⛔';
      }
      setTimeout(() => {
        gateAvatar.classList.remove('error-state');
        if (gateAvatarIcon) {
          gateAvatarIcon.textContent = '🔒';
        }
      }, 1200);
    }

    if (gateFeedback) {
      gateFeedback.textContent = '⛔ Access Denied: Incorrect password. Need a hint? Click below!';
      gateFeedback.className = 'gate-feedback feedback-error';
    }

    if (gatePasswordInput) {
      gatePasswordInput.focus();
      gatePasswordInput.select();
    }
  }

  // Handle Form Submit
  if (securityGateForm) {
    securityGateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = (gatePasswordInput?.value || '').trim().toLowerCase();

      if (entered === CORRECT_PASSPHRASE) {
        unlockWebsite();
      } else {
        rejectPassword();
      }
    });
  }

  // Clear invalid styling when user types
  if (gatePasswordInput) {
    gatePasswordInput.addEventListener('input', () => {
      if (gateInputWrapper && gateInputWrapper.classList.contains('is-invalid')) {
        gateInputWrapper.className = 'gate-input-wrapper';
      }
      if (gateFeedback && gateFeedback.classList.contains('feedback-error')) {
        gateFeedback.textContent = '';
      }
    });
  }

  // Lock Site Button in Navbar
  if (lockSiteBtn) {
    lockSiteBtn.addEventListener('click', () => {
      sfx.playLockClick();

      // Reset UI elements
      document.body.classList.add('site-locked');
      if (securityGateOverlay) {
        securityGateOverlay.classList.remove('gate-unlocked');
      }
      if (gatePasswordInput) {
        gatePasswordInput.disabled = false;
        gatePasswordInput.value = '';
        setTimeout(() => gatePasswordInput.focus(), 150);
      }
      if (gateSubmitBtn) {
        gateSubmitBtn.disabled = false;
      }
      if (gateBtnIcon) {
        gateBtnIcon.textContent = '🔓';
      }
      if (gateBtnLabel) {
        gateBtnLabel.textContent = 'Unlock Clearance';
      }
      if (gateAvatar) {
        gateAvatar.className = 'gate-avatar';
      }
      if (gateAvatarIcon) {
        gateAvatarIcon.textContent = '🔒';
      }
      if (gateInputWrapper) {
        gateInputWrapper.className = 'gate-input-wrapper';
      }
      if (gateFeedback) {
        gateFeedback.textContent = '';
        gateFeedback.className = 'gate-feedback';
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
