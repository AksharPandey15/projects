document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calculate-btn');
    const resultSection = document.getElementById('result-section');
    const stepsContainer = document.getElementById('steps-container');
    const finalResultDiv = document.getElementById('final-result');
    const percentageSpan = document.getElementById('percentage');
    const messageEl = document.getElementById('message');
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    calcBtn.addEventListener('click', calculateLove);

    function calculateLove() {
        const name1 = document.getElementById('name1').value.trim();
        const name2 = document.getElementById('name2').value.trim();
        
        if (!name1 || !name2) {
            alert("Please enter both names.");
            return;
        }

        // Reset UI
        resultSection.classList.remove('hidden');
        finalResultDiv.classList.remove('show');
        finalResultDiv.classList.add('hidden');
        stepsContainer.innerHTML = '';
        percentageSpan.innerText = '0';
        circle.style.strokeDashoffset = circumference;
        messageEl.innerText = '';

        let str1 = name1.toLowerCase().replace(/[^a-z]/g, '');
        let str2 = name2.toLowerCase().replace(/[^a-z]/g, '');

        // 1. Count frequencies in both strings
        let freq1 = {};
        for (let c of str1) {
            freq1[c] = (freq1[c] || 0) + 1;
        }
        let freq2 = {};
        for (let c of str2) {
            freq2[c] = (freq2[c] || 0) + 1;
        }

        let array = [];
        let totalPairs = 0;
        
        // 2. Find matching pairs for each character
        let allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
        for (let c of allChars) {
            if (freq1[c] && freq2[c]) {
                let pairs = Math.min(freq1[c], freq2[c]);
                totalPairs += pairs;
            }
        }

        // 3. Push a '2' for each matching pair
        for (let i = 0; i < totalPairs; i++) {
            array.push(2);
        }

        // 4. Calculate remaining non-paired letters
        let remaining = (str1.length + str2.length) - (totalPairs * 2);
        
        // 5. Push a '1' for each remaining letter
        for (let i = 0; i < remaining; i++) {
            array.push(1);
        }
        
        // Failsafe if names are empty or have no letters
        if(array.length === 0) array = [0];

        let steps = [array.slice()];
        
        // 5. Repeatedly add outer digits together until 2 digits remain
        while (array.length > 2) {
            // Custom rule: if the second-to-last step (3 digits) is below 125, 
            // stop reducing and show this number as the final percentage!
            if (array.length === 3) {
                let currentNum = parseInt(array.join(''));
                if (currentNum < 125) {
                    break;
                }
            }

            let nextArray = [];
            let left = 0;
            let right = array.length - 1;
            
            while (left < right) {
                let sum = array[left] + array[right];
                // If sum >= 10, split the digits
                if (sum >= 10) {
                    let sumStr = sum.toString();
                    for(let char of sumStr) {
                        nextArray.push(parseInt(char));
                    }
                } else {
                    nextArray.push(sum);
                }
                left++;
                right--;
            }
            // If the array had an odd length, drop the middle element down unchanged
            if (left === right) {
                nextArray.push(array[left]);
            }
            array = nextArray;
            steps.push(array.slice());
        }

        let percentage = parseInt(array.join(''));
        if (array.length === 0) percentage = 0;
        if (array.length === 1) percentage = array[0];
        
        // Removed the percentage > 100 cap so numbers like 122 can be displayed

        renderStepsAndResult(steps, percentage);
    }

    function renderStepsAndResult(steps, finalPercentage) {
        // Render step by step calculation
        steps.forEach((stepArray, index) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 'step-row';
                div.innerText = stepArray.join(' ');
                stepsContainer.appendChild(div);
                
                // Scroll to bottom of container if it gets too long
                stepsContainer.scrollTop = stepsContainer.scrollHeight;
            }, index * 400); // 400ms delay per step
        });

        const totalTime = steps.length * 400;

        // Reveal final circle and animate
        setTimeout(() => {
            finalResultDiv.classList.remove('hidden');
            // Give it a tiny tick to apply 'hidden' removal before animating scale in
            setTimeout(() => {
                finalResultDiv.classList.add('show');
                animateValue(percentageSpan, 0, finalPercentage, 2000);
                
                const offset = circumference - (finalPercentage / 100) * circumference;
                circle.style.strokeDashoffset = offset;
                
                setTimeout(() => {
                    let msg = "";
                    if (finalPercentage >= 90) msg = "Perfect Match! 💘✨";
                    else if (finalPercentage >= 75) msg = "True Love! ❤️🔥";
                    else if (finalPercentage >= 50) msg = "There's a spark! 💖";
                    else if (finalPercentage >= 25) msg = "Could be friends! 🤝";
                    else msg = "Not meant to be! 💔";
                    
                    messageEl.innerText = msg;
                    messageEl.style.animation = "fadeIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                }, 2000); // Wait for the circle animation to finish
            }, 50);
        }, totalTime + 300);
    }

    // Function to animate numbers counting up
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
