/**
 * Love Calculator - High Performance Modern Script
 * Optimized for Mobile (iOS & Android) with Touch & Web Audio
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('love-form');
    const calcBtn = document.getElementById('calculate-btn');
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const resultSection = document.getElementById('result-section');
    const stepsContainer = document.getElementById('steps-container');
    const stepsBadge = document.getElementById('steps-count-badge');
    const statusText = document.getElementById('status-text');
    const skipBtn = document.getElementById('skip-btn');
    const finalResultDiv = document.getElementById('final-result');
    const percentageSpan = document.getElementById('percentage');
    const messageEl = document.getElementById('message');
    const verdictPill = document.getElementById('verdict-pill');
    const verdictDesc = document.getElementById('verdict-description');
    const circle = document.querySelector('.progress-ring__circle');
    const toast = document.getElementById('toast');
    const shareBtn = document.getElementById('share-btn');
    const retryBtn = document.getElementById('retry-btn');
    const clearBtns = document.querySelectorAll('.clear-input-btn');
    const quickPills = document.querySelectorAll('.quick-pill');

    // Compatibility bars
    const passionVal = document.getElementById('passion-val');
    const passionBar = document.getElementById('passion-bar');
    const trustVal = document.getElementById('trust-val');
    const trustBar = document.getElementById('trust-bar');
    const harmonyVal = document.getElementById('harmony-val');
    const harmonyBar = document.getElementById('harmony-bar');

    // Progress Ring Calculation (Ultra-safe for all mobile browser versions)
    const radius = (circle && circle.r && circle.r.baseVal && circle.r.baseVal.value)
        ? circle.r.baseVal.value
        : (circle ? parseFloat(circle.getAttribute('r')) || 66 : 66);
    const circumference = radius * 2 * Math.PI;

    if (circle) {
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    }

    // Clear input button listeners
    clearBtns.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);

        targetInput?.addEventListener('input', () => {
            btn.classList.toggle('visible', targetInput.value.length > 0);
        });

        btn.addEventListener('click', () => {
            if (targetInput) {
                targetInput.value = '';
                targetInput.focus();
                btn.classList.remove('visible');
            }
        });
    });

    // Quick pick pill presets
    quickPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const n1 = pill.getAttribute('data-n1');
            const n2 = pill.getAttribute('data-n2');
            name1Input.value = n1;
            name2Input.value = n2;
            clearBtns.forEach(b => b.classList.add('visible'));
            calculateLove();
        });
    });

    // Handle Form & Enter Key
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateLove();
    });

    calcBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        calculateLove();
    });

    // State & Timers tracking for instant cancellations
    let activeTimeouts = [];
    let isCalculating = false;
    let currentFinalCalculation = null;

    function clearScheduledTimeouts() {
        activeTimeouts.forEach(id => clearTimeout(id));
        activeTimeouts = [];
    }

    // Skip Button Handler
    skipBtn?.addEventListener('click', () => {
        if (!isCalculating || !currentFinalCalculation) return;
        clearScheduledTimeouts();
        // Immediately render all steps
        stepsContainer.innerHTML = '';
        currentFinalCalculation.steps.forEach((stepArray, idx) => {
            const isLast = idx === currentFinalCalculation.steps.length - 1;
            appendStepRow(stepArray, idx + 1, isLast);
        });
        stepsContainer.scrollTop = stepsContainer.scrollHeight;
        revealFinalResult(currentFinalCalculation.percentage, currentFinalCalculation.name1, currentFinalCalculation.name2);
    });

    // Retry Button
    retryBtn?.addEventListener('click', () => {
        name1Input.value = '';
        name2Input.value = '';
        clearBtns.forEach(b => b.classList.remove('visible'));
        resultSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        name1Input.focus();
    });

    // Main Calculate Logic
    function calculateLove() {
        const rawName1 = name1Input.value.trim();
        const rawName2 = name2Input.value.trim();

        if (!rawName1 || !rawName2) {
            showToast('⚠️ Please enter both names!');
            if (!rawName1) name1Input.focus();
            else name2Input.focus();
            return;
        }

        // Dismiss mobile virtual keyboard for clean view
        name1Input.blur();
        name2Input.blur();

        // Cancel previous runs
        clearScheduledTimeouts();
        isCalculating = true;
        calcBtn.disabled = true;

        // Reset and prepare UI
        resultSection.classList.remove('hidden');
        finalResultDiv.classList.add('hidden');
        finalResultDiv.classList.remove('pop');
        skipBtn.classList.remove('hidden');
        stepsContainer.innerHTML = '';
        percentageSpan.innerText = '0';
        if (circle) circle.style.strokeDashoffset = circumference;
        messageEl.innerText = '';
        statusText.innerText = 'Analyzing phonetic harmony...';

        // Smooth scroll towards the result section so mobile users see progress instantly
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);

        // Character Frequency Matching Algorithm
        let str1 = rawName1.toLowerCase().replace(/[^a-z0-9]/g, '');
        let str2 = rawName2.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (!str1) str1 = rawName1.toLowerCase();
        if (!str2) str2 = rawName2.toLowerCase();

        let freq1 = {};
        for (let c of str1) freq1[c] = (freq1[c] || 0) + 1;
        let freq2 = {};
        for (let c of str2) freq2[c] = (freq2[c] || 0) + 1;

        let array = [];
        let totalPairs = 0;
        let allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);

        for (let c of allChars) {
            if (freq1[c] && freq2[c]) {
                let pairs = Math.min(freq1[c], freq2[c]);
                totalPairs += pairs;
            }
        }

        // Push '2' for each pair
        for (let i = 0; i < totalPairs; i++) array.push(2);

        // Push '1' for non-paired remaining letters
        let remaining = (str1.length + str2.length) - (totalPairs * 2);
        for (let i = 0; i < remaining; i++) array.push(1);

        if (array.length === 0) array = [0];

        let steps = [array.slice()];

        // Reduce steps outer digits addition
        while (array.length > 2) {
            if (array.length === 3) {
                let currentNum = parseInt(array.join(''));
                if (currentNum < 500) break;
            }

            let nextArray = [];
            let left = 0;
            let right = array.length - 1;

            while (left < right) {
                let sum = array[left] + array[right];
                if (sum >= 10) {
                    let sumStr = sum.toString();
                    for (let char of sumStr) {
                        nextArray.push(parseInt(char));
                    }
                } else {
                    nextArray.push(sum);
                }
                left++;
                right--;
            }

            if (left === right) {
                nextArray.push(array[left]);
            }

            array = nextArray;
            steps.push(array.slice());
        }

        let finalPercentage = parseInt(array.join(''));
        if (array.length === 0) finalPercentage = 0;
        if (array.length === 1) finalPercentage = array[0];

        currentFinalCalculation = {
            steps,
            percentage: finalPercentage,
            name1: rawName1,
            name2: rawName2
        };

        stepsBadge.innerText = `${steps.length} Steps`;

        // Responsive animation timing: snappier on mobile (180ms - 220ms)
        const stepDelay = Math.max(160, Math.min(240, Math.floor(2200 / (steps.length || 1))));

        steps.forEach((stepArray, idx) => {
            const timeoutId = setTimeout(() => {
                const isLast = idx === steps.length - 1;
                appendStepRow(stepArray, idx + 1, isLast);
                if (navigator.vibrate) navigator.vibrate(15);
                stepsContainer.scrollTop = stepsContainer.scrollHeight;

                if (idx === Math.floor(steps.length / 2)) {
                    statusText.innerText = 'Calculating destiny convergence...';
                }
            }, idx * stepDelay);
            activeTimeouts.push(timeoutId);
        });

        const totalStepsTime = steps.length * stepDelay;

        // Reveal final result
        const finishTimeout = setTimeout(() => {
            revealFinalResult(finalPercentage, rawName1, rawName2);
        }, totalStepsTime + 150);
        activeTimeouts.push(finishTimeout);
    }

    function appendStepRow(stepArray, stepNum, isLast = false) {
        const row = document.createElement('div');
        row.className = `step-row ${isLast ? 'final-step' : ''}`;

        const label = document.createElement('span');
        label.className = 'step-label';
        label.innerText = isLast ? 'Result:' : `Step ${stepNum}`;
        row.appendChild(label);

        const digitsWrap = document.createElement('div');
        digitsWrap.className = 'digits-container';

        stepArray.forEach(d => {
            const pill = document.createElement('span');
            pill.className = 'digit-pill';
            pill.innerText = d;
            digitsWrap.appendChild(pill);
        });

        row.appendChild(digitsWrap);
        stepsContainer.appendChild(row);
    }

    function revealFinalResult(finalPercentage, name1, name2) {
        isCalculating = false;
        calcBtn.disabled = false;
        skipBtn.classList.add('hidden');
        statusText.innerText = 'Compatibility complete! ✨';

        finalResultDiv.classList.remove('hidden');

        // Smooth scroll to final card
        setTimeout(() => {
            finalResultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);

        // Animate counter and ring
        animateValue(percentageSpan, 0, finalPercentage, 1600);

        if (circle) {
            const offset = circumference - (Math.min(finalPercentage, 100) / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        // Haptic Celebration
        if (navigator.vibrate) navigator.vibrate([40, 60, 100]);

        // Confetti burst on higher scores
        if (finalPercentage >= 60) {
            triggerConfetti();
        }

        // Verdict & Description
        const verdictInfo = getVerdictData(finalPercentage);
        verdictPill.innerText = verdictInfo.badge;
        messageEl.innerText = verdictInfo.title;
        verdictDesc.innerText = verdictInfo.desc;

        // Affinity Breakdown Bars
        const passion = Math.min(100, Math.max(15, Math.round(finalPercentage * 0.95 + (Math.random() * 8 - 4))));
        const trust = Math.min(100, Math.max(20, Math.round(finalPercentage * 0.88 + 12)));
        const harmony = Math.min(100, Math.max(10, Math.round(finalPercentage * 0.92 + 5)));

        passionVal.innerText = `${passion}%`;
        passionBar.style.width = `${passion}%`;

        trustVal.innerText = `${trust}%`;
        trustBar.style.width = `${trust}%`;

        harmonyVal.innerText = `${harmony}%`;
        harmonyBar.style.width = `${harmony}%`;

        // Update Share button setup
        if (shareBtn) {
            shareBtn.onclick = () => handleShare(name1, name2, finalPercentage, verdictInfo.badge);
        }
    }

    function getVerdictData(percentage) {
        if (percentage >= 95) {
            return {
                badge: 'Cosmic Twin Flames ✨',
                title: 'Exceptional Cosmic Match! 💘💫',
                desc: 'Your bond is written in the stars! You share an instinctive understanding, infectious chemistry, and unbreakable trust.'
            };
        } else if (percentage >= 85) {
            return {
                badge: 'Soulmates ❤️',
                title: 'True Love Connection! 🔥❤️',
                desc: 'A profoundly rare spark with incredible mutual respect, effortless conversation, and captivating romance.'
            };
        } else if (percentage >= 70) {
            return {
                badge: 'Passionate Chemistry 💖',
                title: 'Magnetic Chemistry! 🌹✨',
                desc: 'High energy and natural excitement. With open hearts, your journey together can bloom into something unforgettable.'
            };
        } else if (percentage >= 50) {
            return {
                badge: 'Sweet Potential 💫',
                title: 'There Is A Special Spark! 🌟',
                desc: 'A warm and playful dynamic. Taking the time to explore each other’s worlds can uncover genuine magic.'
            };
        } else if (percentage >= 30) {
            return {
                badge: 'Great Companions 🤝',
                title: 'Wonderful Friendly Vibe! 🥂',
                desc: 'Fantastic foundation for honest friendship, shared laughs, and unforgettable memories without pressure.'
            };
        } else {
            return {
                badge: 'Unique Contrasts ⚡',
                title: 'Opposites Attract! 🔮',
                desc: 'You bring wonderfully different worlds together. Every day is a fascinating journey of learning from one another!'
            };
        }
    }

    // Number counting animation
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out quad
            const easeOut = 1 - (1 - progress) * (1 - progress);
            obj.innerHTML = Math.floor(easeOut * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Native Share
    function handleShare(n1, n2, pct, badge) {
        const shareMessage = `${n1} and ${n2} scored ${pct}% (${badge}) on the Love Calculator!`;

        if (navigator.share) {
            navigator.share({
                title: 'Our Love Compatibility Score',
                text: shareMessage,
                url: window.location.href
            }).catch(() => {
                // User dismissed native share sheet
            });
        }
    }

    // Toast Alert
    let toastTimeout = null;
    function showToast(message) {
        if (!toast) return;
        const msgEl = document.getElementById('toast-msg');
        if (msgEl) msgEl.innerText = message;
        
        toast.classList.remove('hidden');

        // Force browser reflow to reliably restart CSS animation every time
        toast.style.animation = 'none';
        void toast.offsetWidth;
        toast.style.animation = '';

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2600);
    }

    /* ==========================================================================
       GPU-LIGHTWEIGHT AMBIENT BACKGROUND (Optimized for Mobile Battery)
       ========================================================================== */
    const ambientCanvas = document.getElementById('ambient-canvas');
    if (ambientCanvas) {
        const ctx = ambientCanvas.getContext('2d');
        let width = ambientCanvas.width = window.innerWidth;
        let height = ambientCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = ambientCanvas.width = window.innerWidth;
            height = ambientCanvas.height = window.innerHeight;
        });

        // 14 floating ambient hearts
        const particles = [];
        const colors = ['rgba(255, 42, 109, 0.16)', 'rgba(255, 105, 180, 0.14)', 'rgba(255, 182, 193, 0.18)', 'rgba(254, 207, 239, 0.2)'];

        for (let i = 0; i < 14; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 16 + 10,
                speedY: -(Math.random() * 0.6 + 0.3),
                speedX: (Math.random() - 0.5) * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.6 + 0.3
            });
        }

        function drawHeart(c, x, y, size, color) {
            c.save();
            c.translate(x, y);
            c.beginPath();
            const topCurveHeight = size * 0.3;
            c.moveTo(0, topCurveHeight);
            // top left curve
            c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
            // bottom left curve
            c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
            // bottom right curve
            c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
            // top right curve
            c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
            c.closePath();
            c.fillStyle = color;
            c.fill();
            c.restore();
        }

        let isVisible = true;
        document.addEventListener('visibilitychange', () => {
            isVisible = (document.visibilityState === 'visible');
        });

        function renderAmbient() {
            if (isVisible) {
                ctx.clearRect(0, 0, width, height);
                for (let p of particles) {
                    p.y += p.speedY;
                    p.x += p.speedX;

                    if (p.y < -30) {
                        p.y = height + 20;
                        p.x = Math.random() * width;
                    }
                    if (p.x < -30) p.x = width + 20;
                    if (p.x > width + 30) p.x = -20;

                    drawHeart(ctx, p.x, p.y, p.size, p.color);
                }
            }
            requestAnimationFrame(renderAmbient);
        }
        renderAmbient();

        // Tap/click to spawn cute floating heart
        window.addEventListener('click', (e) => {
            // Ignore if clicking on interactive form inputs/buttons
            if (e.target.closest('input, button, .steps-box')) return;
            particles.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 18 + 14,
                speedY: -(Math.random() * 1.5 + 1),
                speedX: (Math.random() - 0.5) * 1.2,
                color: 'rgba(255, 42, 109, 0.45)',
                opacity: 0.9
            });
            if (particles.length > 25) particles.shift();
        }, { passive: true });
    }

    /* ==========================================================================
       CONFETTI CANNON FOR CELEBRATION
       ========================================================================== */
    const confettiCanvas = document.getElementById('confetti-canvas');
    function triggerConfetti() {
        if (!confettiCanvas) return;
        const ctx = confettiCanvas.getContext('2d');
        let cw = confettiCanvas.width = window.innerWidth;
        let ch = confettiCanvas.height = window.innerHeight;

        const confettiColors = ['#ff2a6d', '#ff5277', '#ffd166', '#ff758c', '#a855f7', '#38bdf8', '#ff9a9e'];
        const pieces = [];

        for (let i = 0; i < 70; i++) {
            pieces.push({
                x: cw / 2 + (Math.random() - 0.5) * 80,
                y: ch * 0.45,
                vx: (Math.random() - 0.5) * 14,
                vy: -(Math.random() * 12 + 6),
                size: Math.random() * 8 + 6,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.35,
                opacity: 1
            });
        }

        let animFrame;
        function updateConfetti() {
            ctx.clearRect(0, 0, cw, ch);
            let active = false;

            for (let p of pieces) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.98;
                p.rotation += p.rSpeed;
                p.opacity -= 0.009;

                if (p.opacity > 0 && p.y < ch + 20) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            }

            if (active) {
                animFrame = requestAnimationFrame(updateConfetti);
            } else {
                ctx.clearRect(0, 0, cw, ch);
                cancelAnimationFrame(animFrame);
            }
        }
        updateConfetti();
    }
});
