/**
 * Love Calculator & FLAMES Game - High Performance Modern Script
 * Optimized for Mobile (iOS & Android) with Touch & GPU Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode State
    let currentMode = 'percentage'; // 'percentage' | 'flames'

    // DOM Elements - Mode Switcher
    const btnModePercentage = document.getElementById('btn-mode-percentage');
    const btnModeFlames = document.getElementById('btn-mode-flames');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const connectorIcon = document.getElementById('connector-icon');

    // DOM Elements - Form & Inputs
    const form = document.getElementById('love-form');
    const calcBtn = document.getElementById('calculate-btn');
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const clearBtns = document.querySelectorAll('.clear-input-btn');
    const quickPills = document.querySelectorAll('.quick-pill');

    // DOM Elements - Results & Steps
    const resultSection = document.getElementById('result-section');
    const statusText = document.getElementById('status-text');
    const skipBtn = document.getElementById('skip-btn');
    const flamesBoard = document.getElementById('flames-board');
    const flamesBadges = document.querySelectorAll('.flames-badge');
    const stepsTitle = document.getElementById('steps-title');
    const stepsBadge = document.getElementById('steps-count-badge');
    const stepsContainer = document.getElementById('steps-container');

    // DOM Elements - Final Result
    const finalResultDiv = document.getElementById('final-result');
    const percentageRingContainer = document.getElementById('percentage-ring-container');
    const flamesEmblemContainer = document.getElementById('flames-emblem-container');
    const percentageSpan = document.getElementById('percentage');
    const destinyEmoji = document.getElementById('destiny-emoji');
    const destinyLetter = document.getElementById('destiny-letter');
    const destinyWord = document.getElementById('destiny-word');
    const verdictPill = document.getElementById('verdict-pill');
    const messageEl = document.getElementById('message');
    const verdictDesc = document.getElementById('verdict-description');
    const circle = document.querySelector('.progress-ring__circle');

    // DOM Elements - Compatibility bars
    const passionVal = document.getElementById('passion-val');
    const passionBar = document.getElementById('passion-bar');
    const trustVal = document.getElementById('trust-val');
    const trustBar = document.getElementById('trust-bar');
    const harmonyVal = document.getElementById('harmony-val');
    const harmonyBar = document.getElementById('harmony-bar');

    // Action Buttons
    const shareBtn = document.getElementById('share-btn');
    const retryBtn = document.getElementById('retry-btn');
    const toast = document.getElementById('toast');

    // Progress Ring Initialization
    const radius = (circle && circle.r && circle.r.baseVal && circle.r.baseVal.value)
        ? circle.r.baseVal.value
        : (circle ? parseFloat(circle.getAttribute('r')) || 66 : 66);
    const circumference = radius * 2 * Math.PI;

    if (circle) {
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    }

    // State & Timers tracking
    let activeTimeouts = [];
    let isCalculating = false;
    let currentCalculationState = null;

    function clearScheduledTimeouts() {
        activeTimeouts.forEach(id => clearTimeout(id));
        activeTimeouts = [];
    }

    // ==========================================================================
    // FLAMES METADATA DICTIONARY
    // ==========================================================================
    const FLAMES_DATA = {
        'F': {
            name: 'Friends',
            emoji: '🤝',
            badge: 'Best Friends Forever 🤝',
            title: 'Unbreakable Best Friends! 🤝💫',
            desc: 'A match founded on effortless laughter, loyalty, and deep trust. You understand each other without saying a word — true partners in crime!',
            bars: [
                { label: 'Trust & Loyalty', val: 98 },
                { label: 'Banter & Fun', val: 96 },
                { label: 'Long-Term Bond', val: 94 }
            ]
        },
        'L': {
            name: 'Love',
            emoji: '❤️',
            badge: 'True Love Connection ❤️',
            title: 'Passionate Cosmic Love! ❤️🔥',
            desc: 'The universe has aligned your paths! Magnetic chemistry, electric romance, and deep attraction that only grows stronger over time.',
            bars: [
                { label: 'Romantic Chemistry', val: 99 },
                { label: 'Electric Passion', val: 97 },
                { label: 'Soul Harmony', val: 95 }
            ]
        },
        'A': {
            name: 'Affection',
            emoji: '🥰',
            badge: 'Sweet Affection 🥰',
            title: 'Tender & Sweet Affection! 🥰✨',
            desc: 'Endless butterflies, gentle hugs, and heartwarming care. You bring out the softest, most loving and attentive versions of one another.',
            bars: [
                { label: 'Warmth & Cuteness', val: 97 },
                { label: 'Emotional Comfort', val: 95 },
                { label: 'Gentle Fondness', val: 93 }
            ]
        },
        'M': {
            name: 'Marriage',
            emoji: '💍',
            badge: 'Destined For Marriage 💍',
            title: 'Destined For Marriage! 💍👑',
            desc: 'A timeless union written in the stars! Rock-solid devotion, shared values, and a soulmate partnership built for a lifetime of happiness.',
            bars: [
                { label: 'Lifelong Devotion', val: 99 },
                { label: 'Soul Partnership', val: 98 },
                { label: 'Unshakable Trust', val: 96 }
            ]
        },
        'E': {
            name: 'Enemy',
            emoji: '⚔️',
            badge: 'Frenemies / Rivals ⚔️',
            title: 'Enemies-To-Lovers Tension! ⚔️⚡',
            desc: 'Sparks fly whenever you clash! Intense arguments, fierce rivalry, and stubborn pride that mask an undeniable magnetic attraction.',
            bars: [
                { label: 'Dramatic Tension', val: 99 },
                { label: 'Competitive Fire', val: 96 },
                { label: 'Hidden Chemistry', val: 82 }
            ]
        },
        'S': {
            name: 'Siblings',
            emoji: '👫',
            badge: 'Sibling Energy 👫',
            title: 'Playful Sibling Bond! 👫🍕',
            desc: 'Endless teasing, stealing food, and knowing each other’s deepest secrets. Utter comfort and protective care with zero romantic drama!',
            bars: [
                { label: 'Family Comfort', val: 98 },
                { label: 'Teasing Quotient', val: 97 },
                { label: 'Protective Loyalty', val: 95 }
            ]
        }
    };

    // ==========================================================================
    // MODE SWITCHER LOGIC
    // ==========================================================================
    function switchMode(newMode) {
        if (currentMode === newMode && !isCalculating) return;
        currentMode = newMode;
        clearScheduledTimeouts();
        isCalculating = false;
        calcBtn.disabled = false;
        resultSection.classList.add('hidden');
        resetFlamesBoard();

        if (currentMode === 'percentage') {
            btnModePercentage.classList.add('active');
            btnModePercentage.setAttribute('aria-selected', 'true');
            btnModeFlames.classList.remove('active');
            btnModeFlames.setAttribute('aria-selected', 'false');

            pageTitle.innerHTML = 'Love Calculator <span class="heart-pulse" id="title-icon">💖</span>';
            pageSubtitle.innerText = 'Enter two names to reveal your deep cosmic harmony & step-by-step math';
            btnText.innerText = 'Calculate Percentage';
            btnIcon.innerText = '✨';
            stepsTitle.innerText = 'Algorithm Breakdown';
            flamesBoard.classList.add('hidden');
        } else {
            btnModeFlames.classList.add('active');
            btnModeFlames.setAttribute('aria-selected', 'true');
            btnModePercentage.classList.remove('active');
            btnModePercentage.setAttribute('aria-selected', 'false');

            pageTitle.innerHTML = 'FLAMES Game <span class="heart-pulse" id="title-icon">🔥</span>';
            pageSubtitle.innerText = 'Enter two names to reveal your relationship destiny through the legendary FLAMES test';
            btnText.innerText = 'Reveal FLAMES Destiny';
            btnIcon.innerText = '🔥';
            stepsTitle.innerText = 'Elimination Breakdown';
            flamesBoard.classList.remove('hidden');
        }
    }

    btnModePercentage?.addEventListener('click', () => switchMode('percentage'));
    btnModeFlames?.addEventListener('click', () => switchMode('flames'));

    function resetFlamesBoard() {
        flamesBadges.forEach(badge => {
            badge.classList.remove('eliminated', 'winner', 'active-count');
        });
    }

    // ==========================================================================
    // INPUT LISTENERS & QUICK PICKS
    // ==========================================================================
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

    quickPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const n1 = pill.getAttribute('data-n1');
            const n2 = pill.getAttribute('data-n2');
            name1Input.value = n1;
            name2Input.value = n2;
            clearBtns.forEach(b => b.classList.add('visible'));
            startCalculation();
        });
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        startCalculation();
    });

    calcBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        startCalculation();
    });

    // ==========================================================================
    // DISPATCHER: START CALCULATION
    // ==========================================================================
    function startCalculation() {
        const rawName1 = name1Input.value.trim();
        const rawName2 = name2Input.value.trim();

        if (!rawName1 || !rawName2) {
            showToast('⚠️ Please enter both names!');
            if (!rawName1) name1Input.focus();
            else name2Input.focus();
            return;
        }

        name1Input.blur();
        name2Input.blur();

        if (currentMode === 'percentage') {
            runPercentageCalculation(rawName1, rawName2);
        } else {
            runFlamesCalculation(rawName1, rawName2);
        }
    }

    // ==========================================================================
    // METHOD 1: LOVE PERCENTAGE ALGORITHM
    // ==========================================================================
    function runPercentageCalculation(rawName1, rawName2) {
        clearScheduledTimeouts();
        isCalculating = true;
        calcBtn.disabled = true;

        resultSection.classList.remove('hidden');
        flamesBoard.classList.add('hidden');
        finalResultDiv.classList.add('hidden');
        skipBtn.classList.remove('hidden');
        stepsContainer.innerHTML = '';
        percentageSpan.innerText = '0';
        if (circle) circle.style.strokeDashoffset = circumference;
        messageEl.innerText = '';
        statusText.innerText = 'Analyzing phonetic harmony...';

        percentageRingContainer.classList.remove('hidden');
        flamesEmblemContainer.classList.add('hidden');

        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);

        let str1 = rawName1.toLowerCase().replace(/[^a-z0-9]/g, '') || rawName1.toLowerCase();
        let str2 = rawName2.toLowerCase().replace(/[^a-z0-9]/g, '') || rawName2.toLowerCase();

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

        for (let i = 0; i < totalPairs; i++) array.push(2);
        let remaining = (str1.length + str2.length) - (totalPairs * 2);
        for (let i = 0; i < remaining; i++) array.push(1);

        if (array.length === 0) array = [0];

        let steps = [array.slice()];

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
                    for (let char of sum.toString()) nextArray.push(parseInt(char));
                } else {
                    nextArray.push(sum);
                }
                left++;
                right--;
            }

            if (left === right) nextArray.push(array[left]);
            array = nextArray;
            steps.push(array.slice());
        }

        let finalPercentage = parseInt(array.join(''));
        if (array.length === 0) finalPercentage = 0;
        if (array.length === 1) finalPercentage = array[0];

        currentCalculationState = {
            mode: 'percentage',
            steps,
            percentage: finalPercentage,
            name1: rawName1,
            name2: rawName2
        };

        stepsBadge.innerText = `${steps.length} Steps`;
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
        const finishTimeout = setTimeout(() => {
            revealPercentageResult(finalPercentage, rawName1, rawName2);
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

    function revealPercentageResult(finalPercentage, name1, name2) {
        isCalculating = false;
        calcBtn.disabled = false;
        skipBtn.classList.add('hidden');
        statusText.innerText = 'Compatibility complete! ✨';

        finalResultDiv.classList.remove('hidden');

        setTimeout(() => {
            finalResultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);

        animateValue(percentageSpan, 0, finalPercentage, 1600);

        if (circle) {
            const offset = circumference - (Math.min(finalPercentage, 100) / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        if (navigator.vibrate) navigator.vibrate([40, 60, 100]);

        if (finalPercentage >= 60) {
            triggerConfetti();
        }

        const verdictInfo = getVerdictData(finalPercentage);
        verdictPill.innerText = verdictInfo.badge;
        messageEl.innerText = verdictInfo.title;
        verdictDesc.innerText = verdictInfo.desc;

        const passion = Math.min(100, Math.max(15, Math.round(finalPercentage * 0.95 + (Math.random() * 8 - 4))));
        const trust = Math.min(100, Math.max(20, Math.round(finalPercentage * 0.88 + 12)));
        const harmony = Math.min(100, Math.max(10, Math.round(finalPercentage * 0.92 + 5)));

        updateAffinityBars('Passion & Chemistry', passion, 'Communication & Trust', trust, 'Long-Term Harmony', harmony);

        if (shareBtn) {
            shareBtn.onclick = () => handleSharePercentage(name1, name2, finalPercentage, verdictInfo.badge);
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

    // ==========================================================================
    // METHOD 2: FLAMES DESTINY GAME ALGORITHM
    // ==========================================================================
    function runFlamesCalculation(rawName1, rawName2) {
        clearScheduledTimeouts();
        isCalculating = true;
        calcBtn.disabled = true;

        resultSection.classList.remove('hidden');
        flamesBoard.classList.remove('hidden');
        resetFlamesBoard();
        finalResultDiv.classList.add('hidden');
        skipBtn.classList.remove('hidden');
        stepsContainer.innerHTML = '';
        messageEl.innerText = '';
        statusText.innerText = 'Striking matching letters...';

        percentageRingContainer.classList.add('hidden');
        flamesEmblemContainer.classList.remove('hidden');

        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);

        let str1 = rawName1.toLowerCase().replace(/[^a-z]/g, '') || rawName1.toLowerCase();
        let str2 = rawName2.toLowerCase().replace(/[^a-z]/g, '') || rawName2.toLowerCase();

        let chars1 = str1.split('');
        let chars2 = str2.split('');
        let cancelled1 = new Array(chars1.length).fill(false);
        let cancelled2 = new Array(chars2.length).fill(false);
        let cancelledPairs = [];

        for (let i = 0; i < chars1.length; i++) {
            let c = chars1[i];
            for (let j = 0; j < chars2.length; j++) {
                if (!cancelled2[j] && chars2[j] === c) {
                    cancelled1[i] = true;
                    cancelled2[j] = true;
                    cancelledPairs.push(c);
                    break;
                }
            }
        }

        let remainCount1 = cancelled1.filter(v => !v).length;
        let remainCount2 = cancelled2.filter(v => !v).length;
        let remainingCount = remainCount1 + remainCount2;

        // Circular FLAMES elimination simulation
        let flamesList = ['F', 'L', 'A', 'M', 'E', 'S'];
        let rounds = [];
        let startIdx = 0;

        if (remainingCount === 0) {
            // Mirror Match edge case
            rounds.push({
                roundNum: 1,
                eliminated: null,
                remaining: ['L'],
                note: '0 remaining letters! Perfect Mirror Match!'
            });
            flamesList = ['L'];
        } else {
            let roundCounter = 1;
            while (flamesList.length > 1) {
                let elimIdx = (startIdx + remainingCount - 1) % flamesList.length;
                let eliminatedLetter = flamesList[elimIdx];
                let currentStartLetter = flamesList[startIdx];
                flamesList.splice(elimIdx, 1);
                startIdx = elimIdx % flamesList.length;

                rounds.push({
                    roundNum: roundCounter++,
                    eliminated: eliminatedLetter,
                    remaining: flamesList.slice(),
                    startFrom: currentStartLetter,
                    count: remainingCount
                });
            }
        }

        let winnerLetter = flamesList[0];
        let winnerData = FLAMES_DATA[winnerLetter] || FLAMES_DATA['L'];

        currentCalculationState = {
            mode: 'flames',
            rawName1,
            rawName2,
            chars1,
            chars2,
            cancelled1,
            cancelled2,
            cancelledPairs,
            remainingCount,
            rounds,
            winnerLetter,
            winnerData
        };

        stepsBadge.innerText = `${rounds.length + 1} Rounds`;

        // Render Step 0: Name Matching & Letter Cancellation
        const introTimeout = setTimeout(() => {
            appendFlamesLetterMatchSummary(chars1, cancelled1, chars2, cancelled2, remainingCount, rawName1, rawName2);
            statusText.innerText = `Found ${remainingCount} unique remaining letters. Counting FLAMES...`;
            if (navigator.vibrate) navigator.vibrate(20);
        }, 120);
        activeTimeouts.push(introTimeout);

        // Render Rounds Step by Step
        const roundDelay = 480;
        rounds.forEach((rnd, idx) => {
            const timeoutId = setTimeout(() => {
                appendFlamesRoundRow(rnd);
                if (rnd.eliminated) {
                    const badgeEl = document.getElementById(`fb-${rnd.eliminated}`);
                    if (badgeEl) {
                        badgeEl.classList.add('eliminated');
                    }
                }
                if (navigator.vibrate) navigator.vibrate(15);
                stepsContainer.scrollTop = stepsContainer.scrollHeight;
                statusText.innerText = `Round ${rnd.roundNum}: Struck out ${rnd.eliminated ? (FLAMES_DATA[rnd.eliminated]?.name || rnd.eliminated) : 'none'}...`;
            }, 550 + idx * roundDelay);
            activeTimeouts.push(timeoutId);
        });

        // Reveal Final Winner
        const finishDelay = 650 + rounds.length * roundDelay;
        const finishTimeout = setTimeout(() => {
            revealFlamesResult(winnerLetter, winnerData, rawName1, rawName2);
        }, finishDelay);
        activeTimeouts.push(finishTimeout);
    }

    function appendFlamesLetterMatchSummary(chars1, cancelled1, chars2, cancelled2, count, n1, n2) {
        const row = document.createElement('div');
        row.className = 'step-row flames-summary-step';

        const label = document.createElement('span');
        label.className = 'step-label';
        label.innerText = 'Step 1: Letter Matching';
        row.appendChild(label);

        const content = document.createElement('div');
        content.className = 'flames-step-content';

        // Name 1 letters
        const name1Wrap = document.createElement('div');
        name1Wrap.className = 'name-cancel-wrap';
        chars1.forEach((c, idx) => {
            const badge = document.createElement('span');
            badge.className = `char-badge ${cancelled1[idx] ? 'match' : 'remain'}`;
            badge.innerText = c;
            name1Wrap.appendChild(badge);
        });

        const plusSign = document.createElement('span');
        plusSign.innerText = '+';
        plusSign.style.fontWeight = '800';
        plusSign.style.color = 'var(--primary)';

        // Name 2 letters
        const name2Wrap = document.createElement('div');
        name2Wrap.className = 'name-cancel-wrap';
        chars2.forEach((c, idx) => {
            const badge = document.createElement('span');
            badge.className = `char-badge ${cancelled2[idx] ? 'match' : 'remain'}`;
            badge.innerText = c;
            name2Wrap.appendChild(badge);
        });

        const countBadge = document.createElement('span');
        countBadge.className = 'count-badge';
        countBadge.innerText = `Count = ${count}`;

        content.appendChild(name1Wrap);
        content.appendChild(plusSign);
        content.appendChild(name2Wrap);
        content.appendChild(countBadge);
        row.appendChild(content);

        stepsContainer.appendChild(row);
    }

    function appendFlamesRoundRow(roundData) {
        const row = document.createElement('div');
        row.className = 'step-row';

        const label = document.createElement('span');
        label.className = 'step-label';
        label.innerText = `Round ${roundData.roundNum}:`;
        row.appendChild(label);

        const textWrap = document.createElement('div');
        textWrap.className = 'flames-round-text';

        if (roundData.eliminated) {
            const info = FLAMES_DATA[roundData.eliminated];
            textWrap.innerHTML = `Counted <strong>${roundData.count}</strong> ➔ Struck out <span class="elim-badge"><s>${roundData.eliminated}</s> - ${info?.name || ''} ${info?.emoji || ''}</span> Remaining:`;
            
            const pillsWrap = document.createElement('span');
            pillsWrap.className = 'remain-pills';
            roundData.remaining.forEach(ltr => {
                const pill = document.createElement('span');
                pill.className = 'mini-pill';
                pill.innerText = ltr;
                pillsWrap.appendChild(pill);
            });
            textWrap.appendChild(pillsWrap);
        } else {
            textWrap.innerHTML = `<strong>${roundData.note}</strong>`;
        }

        row.appendChild(textWrap);
        stepsContainer.appendChild(row);
    }

    function revealFlamesResult(winnerLetter, winnerData, name1, name2) {
        isCalculating = false;
        calcBtn.disabled = false;
        skipBtn.classList.add('hidden');
        statusText.innerText = 'Destiny revealed! 🔥';

        // Highlight winner on FLAMES board
        flamesBadges.forEach(badge => {
            const letter = badge.getAttribute('data-letter');
            if (letter === winnerLetter) {
                badge.classList.remove('eliminated');
                badge.classList.add('winner');
            } else {
                badge.classList.add('eliminated');
            }
        });

        finalResultDiv.classList.remove('hidden');

        setTimeout(() => {
            finalResultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);

        // Update FLAMES emblem
        destinyEmoji.innerText = winnerData.emoji;
        destinyLetter.innerText = winnerLetter;
        destinyWord.innerText = winnerData.name.toUpperCase();

        if (navigator.vibrate) navigator.vibrate([50, 70, 120]);
        triggerConfetti();

        // Verdict & Description
        verdictPill.innerText = winnerData.badge;
        messageEl.innerText = winnerData.title;
        verdictDesc.innerText = winnerData.desc;

        // Affinity Breakdown Bars
        const b = winnerData.bars;
        updateAffinityBars(b[0].label, b[0].val, b[1].label, b[1].val, b[2].label, b[2].val);

        if (shareBtn) {
            shareBtn.onclick = () => handleShareFlames(name1, name2, winnerData.name, winnerData.emoji);
        }
    }

    // ==========================================================================
    // SKIP TO RESULT HANDLER
    // ==========================================================================
    skipBtn?.addEventListener('click', () => {
        if (!isCalculating || !currentCalculationState) return;
        clearScheduledTimeouts();

        if (currentCalculationState.mode === 'percentage') {
            stepsContainer.innerHTML = '';
            currentCalculationState.steps.forEach((stepArray, idx) => {
                const isLast = idx === currentCalculationState.steps.length - 1;
                appendStepRow(stepArray, idx + 1, isLast);
            });
            stepsContainer.scrollTop = stepsContainer.scrollHeight;
            revealPercentageResult(
                currentCalculationState.percentage,
                currentCalculationState.name1,
                currentCalculationState.name2
            );
        } else {
            stepsContainer.innerHTML = '';
            const s = currentCalculationState;
            appendFlamesLetterMatchSummary(
                s.chars1, s.cancelled1, s.chars2, s.cancelled2, s.remainingCount, s.rawName1, s.rawName2
            );
            s.rounds.forEach(rnd => {
                appendFlamesRoundRow(rnd);
                if (rnd.eliminated) {
                    const badgeEl = document.getElementById(`fb-${rnd.eliminated}`);
                    if (badgeEl) badgeEl.classList.add('eliminated');
                }
            });
            stepsContainer.scrollTop = stepsContainer.scrollHeight;
            revealFlamesResult(s.winnerLetter, s.winnerData, s.rawName1, s.rawName2);
        }
    });

    // ==========================================================================
    // HELPER: UPDATE BARS & ANIMS
    // ==========================================================================
    function updateAffinityBars(label1, val1, label2, val2, label3, val3) {
        const labels = document.querySelectorAll('.breakdown-labels');
        if (labels.length >= 3) {
            labels[0].querySelector('span:first-child').innerText = label1;
            labels[1].querySelector('span:first-child').innerText = label2;
            labels[2].querySelector('span:first-child').innerText = label3;
        }

        passionVal.innerText = `${val1}%`;
        passionBar.style.width = `${val1}%`;

        trustVal.innerText = `${val2}%`;
        trustBar.style.width = `${val2}%`;

        harmonyVal.innerText = `${val3}%`;
        harmonyBar.style.width = `${val3}%`;
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - (1 - progress) * (1 - progress);
            obj.innerHTML = Math.floor(easeOut * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ==========================================================================
    // SHARING HANDLERS
    // ==========================================================================
    function handleSharePercentage(n1, n2, pct, badge) {
        const shareMessage = `${n1} and ${n2} scored ${pct}% (${badge}) on the Love Calculator!`;
        if (navigator.share) {
            navigator.share({
                title: 'Our Love Compatibility Score',
                text: shareMessage,
                url: window.location.href
            }).catch(() => {});
        }
    }

    function handleShareFlames(n1, n2, destinyName, emoji) {
        const shareMessage = `🔥 FLAMES Test: ${n1} + ${n2} got ${destinyName.toUpperCase()} ${emoji}! Discover your relationship destiny here:`;
        if (navigator.share) {
            navigator.share({
                title: 'Our FLAMES Relationship Destiny',
                text: shareMessage,
                url: window.location.href
            }).catch(() => {});
        }
    }

    // Retry Button
    retryBtn?.addEventListener('click', () => {
        name1Input.value = '';
        name2Input.value = '';
        clearBtns.forEach(b => b.classList.remove('visible'));
        resultSection.classList.add('hidden');
        resetFlamesBoard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        name1Input.focus();
    });

    // Toast Alert
    let toastTimeout = null;
    function showToast(message) {
        if (!toast) return;
        const msgEl = document.getElementById('toast-msg');
        if (msgEl) msgEl.innerText = message;

        toast.classList.remove('hidden');
        toast.style.animation = 'none';
        void toast.offsetWidth;
        toast.style.animation = '';

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2600);
    }

    // ==========================================================================
    // GPU LIGHTWEIGHT AMBIENT PARTICLES
    // ==========================================================================
    const ambientCanvas = document.getElementById('ambient-canvas');
    if (ambientCanvas) {
        const ctx = ambientCanvas.getContext('2d');
        let width = ambientCanvas.width = window.innerWidth;
        let height = ambientCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = ambientCanvas.width = window.innerWidth;
            height = ambientCanvas.height = window.innerHeight;
        });

        const particles = [];
        const colors = [
            'rgba(255, 42, 109, 0.16)',
            'rgba(255, 105, 180, 0.14)',
            'rgba(255, 182, 193, 0.18)',
            'rgba(254, 207, 239, 0.2)'
        ];

        for (let i = 0; i < 14; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 16 + 10,
                speedY: -(Math.random() * 0.6 + 0.3),
                speedX: (Math.random() - 0.5) * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function drawHeart(c, x, y, size, color) {
            c.save();
            c.translate(x, y);
            c.beginPath();
            const topCurveHeight = size * 0.3;
            c.moveTo(0, topCurveHeight);
            c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
            c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
            c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
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

        window.addEventListener('click', (e) => {
            if (e.target.closest('input, button, .steps-box')) return;
            particles.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 18 + 14,
                speedY: -(Math.random() * 1.5 + 1),
                speedX: (Math.random() - 0.5) * 1.2,
                color: 'rgba(255, 42, 109, 0.45)'
            });
            if (particles.length > 25) particles.shift();
        }, { passive: true });
    }

    // ==========================================================================
    // CONFETTI CANNON CELEBRATION
    // ==========================================================================
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

    // ==========================================================================
    // SECURITY PASSWORD GATEKEEPER (FRIENDS ONLY)
    // ==========================================================================
    function initSecurityGate() {
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

        const CORRECT_PASSPHRASES = ['friendsonly', 'friends only'];
        let isUnlocking = false;

        // Web Audio Synthesizer
        let gateAudioCtx = null;
        function getGateAudio() {
            if (!gateAudioCtx && (window.AudioContext || window.webkitAudioContext)) {
                gateAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (gateAudioCtx && gateAudioCtx.state === 'suspended') {
                gateAudioCtx.resume();
            }
            return gateAudioCtx;
        }

        function playBuzzer() {
            try {
                const ctx = getGateAudio();
                if (!ctx) return;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(120, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.28);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.28);
            } catch (e) {}
        }

        function playCelebration() {
            try {
                const ctx = getGateAudio();
                if (!ctx) return;
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
                    gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.08);
                    osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
                });
            } catch (e) {}
        }

        function playClick() {
            try {
                const ctx = getGateAudio();
                if (!ctx) return;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.06);
            } catch (e) {}
        }

        // Auto-focus input
        if (gatePasswordInput) {
            setTimeout(() => gatePasswordInput.focus(), 250);
        }

        // Toggle Password Visibility
        if (gateToggleVisibility && gatePasswordInput) {
            gateToggleVisibility.addEventListener('click', () => {
                playClick();
                const isPassword = gatePasswordInput.type === 'password';
                gatePasswordInput.type = isPassword ? 'text' : 'password';
                if (gateEyeIcon) {
                    gateEyeIcon.textContent = isPassword ? '🙈' : '👁️';
                }
                gateToggleVisibility.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
            });
        }

        // Unlock Function
        function unlockWebsite() {
            if (isUnlocking) return;
            isUnlocking = true;

            if (gateFeedback) {
                gateFeedback.textContent = '✅ Access Clearance Granted! Unlocking love engine...';
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
                gateBtnLabel.textContent = 'Clearance Granted!';
            }
            if (gatePasswordInput) {
                gatePasswordInput.disabled = true;
            }
            if (gateSubmitBtn) {
                gateSubmitBtn.disabled = true;
            }

            playCelebration();
            try { launchConfetti(); } catch (e) {}

            setTimeout(() => {
                if (securityGateOverlay) {
                    securityGateOverlay.classList.add('gate-unlocked');
                }
                document.body.classList.remove('site-locked');
                isUnlocking = false;
            }, 600);
        }

        // Reject Function
        function rejectPassword() {
            playBuzzer();

            if (securityGateCard) {
                securityGateCard.classList.remove('shake-card');
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
                if (gateAvatarIcon) gateAvatarIcon.textContent = '⛔';
                setTimeout(() => {
                    gateAvatar.classList.remove('error-state');
                    if (gateAvatarIcon) gateAvatarIcon.textContent = '🔒';
                }, 1200);
            }

            if (gateFeedback) {
                gateFeedback.textContent = '⛔ Access Denied: Incorrect password! Please try again.';
                gateFeedback.className = 'gate-feedback feedback-error';
            }

            if (gatePasswordInput) {
                gatePasswordInput.focus();
                gatePasswordInput.select();
            }
        }

        // Form Submit
        if (securityGateForm) {
            securityGateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const entered = (gatePasswordInput?.value || '').trim().toLowerCase();

                if (CORRECT_PASSPHRASES.includes(entered)) {
                    unlockWebsite();
                } else {
                    rejectPassword();
                }
            });
        }

        // Reset error on input
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

        // Lock button
        if (lockSiteBtn) {
            lockSiteBtn.addEventListener('click', () => {
                playClick();
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
                    gateBtnLabel.textContent = 'Unlock Love Engine';
                }
                if (gateInputWrapper) {
                    gateInputWrapper.className = 'gate-input-wrapper';
                }
                if (gateFeedback) {
                    gateFeedback.textContent = '';
                    gateFeedback.className = 'gate-feedback';
                }
                if (gateAvatar) {
                    gateAvatar.className = 'gate-avatar';
                    if (gateAvatarIcon) gateAvatarIcon.textContent = '🔒';
                }
            });
        }
    }

    initSecurityGate();
});
