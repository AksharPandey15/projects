function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Basic setups
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.innerHTML = new Date().getFullYear();

    const hrs = new Date().getHours();
    let greet = 'Good Evening';
    if (hrs < 12) greet = 'Good Morning';
    else if (hrs < 17) greet = 'Good Afternoon';
    const greetEl = document.getElementById('greetings');
    if (greetEl) greetEl.innerHTML = greet + ",";

    // Email logic
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get("email");
    const navLinks = document.getElementById("nav-links");

    if (userEmail && navLinks) {
        const loginLink = document.getElementById("login-link");
        if (loginLink) loginLink.remove();

        const emailItem = document.createElement("li");
        emailItem.style.color = "var(--text-secondary)";
        emailItem.textContent = decodeURIComponent(userEmail);
        navLinks.appendChild(emailItem);
    }

    // Mac/Linux Check
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Mac') !== -1 || userAgent.indexOf('Linux') !== -1) {
        const hElements = document.getElementsByClassName('h');
        for (let element of hElements) {
            element.textContent = 'Unavailable on macOS/Linux';
        }
    }

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    document.querySelectorAll('a, button, .magnetic-btn, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('cursor-grow');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('cursor-grow');
        });
    });

    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.project-card, .hero-content, .section-title').forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    // Dev Mode Console Logic
    const devModeBtn = document.getElementById("dev-mode-btn");
    const consoleLayer = document.getElementById("console-layer");
    const consoleInput = document.getElementById("console-input");
    const consoleOutput = document.getElementById("console-output");

    let badAppleInterval = null;
    let badAppleAudio = null;

    function getLoginMessage() {
        const d = new Date();
        const parts = d.toString().split(" ");
        return `Last login: ${parts[0]} ${parts[1]} ${parts[2]} ${parts[4]} on ttys000`;
    }
    const initialConsoleContent = `<div class="console-line">${getLoginMessage()}</div>
                                   <div class="console-line">Type 'help' to see available commands.</div>`;

    if (consoleOutput) {
        consoleOutput.innerHTML = initialConsoleContent;
    }

    if (devModeBtn && consoleLayer && consoleInput) {
        devModeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            consoleLayer.classList.remove("hidden-console");
            consoleInput.focus();
        });

        consoleLayer.addEventListener("click", () => {
            consoleInput.focus();
        });

        consoleInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const cmd = consoleInput.value.trim();
                consoleInput.value = "";

                if (cmd === "") return;

                printToConsole(`admin@akshar:~$ ${cmd}`, "");
                executeCommand(cmd.toLowerCase());
            }
        });
    }

    function printToConsole(text, className = "") {
        const line = document.createElement("div");
        line.className = `console-line ${className}`;
        line.textContent = text;
        consoleOutput.appendChild(line);
        consoleLayer.scrollTop = consoleLayer.scrollHeight;
    }

    function executeCommand(cmd) {
        switch (cmd) {
            case "help":
                printToConsole("Available commands:", "info");
                printToConsole("  help     - Show this help message");
                printToConsole("  projects - List total number of projects");
                printToConsole("  whoami   - Display bio");
                printToConsole("  clear    - Clear console output");
                printToConsole("  exit     - Exit Dev Mode");
                break;
            case "projects":
                const count = document.querySelectorAll(".project-card").length;
                printToConsole(`You have ${count} projects in your portfolio.`, "success");
                break;
            case "whoami":
                printToConsole("Akshar Pandey - Developer & Designer.", "info");
                printToConsole("Building clean, high-performance applications.");
                break;
            case "clear":
                consoleOutput.innerHTML = "";
                if (badAppleInterval) clearInterval(badAppleInterval);
                if (badAppleAudio) { badAppleAudio.pause(); badAppleAudio.currentTime = 0; }
                break;
            case "exit":
                if (badAppleInterval) clearInterval(badAppleInterval);
                if (badAppleAudio) { badAppleAudio.pause(); badAppleAudio.currentTime = 0; }
                printToConsole("Exiting Dev Mode...", "info");
                setTimeout(() => {
                    consoleLayer.classList.add("hidden-console");
                    consoleOutput.innerHTML = initialConsoleContent;
                }, 500);
                break;
            case "matrix":
                printToConsole("Wake up, Neo...", "success");
                setTimeout(() => printToConsole("The Matrix has you...", "success"), 1000);
                setTimeout(() => printToConsole("Follow the white rabbit.", "success"), 2500);
                break;
            case "bad_apple":
            case "01100010,01100001,01110000,01101100,01100101":
            case "01100010,01100001,01100100,01100001,01110000,01110000,01101100,01100101":
                setTimeout(() => {
                    playBadAppleASCII();
                }, 500);
                break;
            default:
                printToConsole(`Command not found: ${cmd}`, "error");
        }
    }

    async function playBadAppleASCII() {
        const artContainer = document.createElement("pre");
        artContainer.style.color = "#00ff00";
        artContainer.style.fontFamily = "monospace";
        artContainer.style.lineHeight = "1.2";
        artContainer.style.letterSpacing = "1.5ch";
        artContainer.style.fontSize = "6px";
        artContainer.style.marginTop = "10px";
        consoleOutput.appendChild(artContainer);
        consoleLayer.scrollTop = consoleLayer.scrollHeight;

        try {
            const response = await fetch("data.txt");
            if (!response.ok) throw new Error("Could not load data.txt");
            const strin = await response.text();

            // Decode RLE Data
            let splitStuff = strin.split("m");
            let smol = [];
            for (let i = 0; i < splitStuff.length; i++) {
                if (splitStuff[i].trim() === "") continue;
                let arr = splitStuff[i].split(",");
                smol.push(arr);
            }

            for (let i = 0; i < smol.length; i++) {
                if (i > 0) {
                    smol[i].shift();
                } else if (smol.length > 0 && smol[0].length > 0) {
                    smol[0][0] = 0;
                }
                for (let j = 0; j < smol[i].length; j++) {
                    smol[i][j] = parseInt(smol[i][j]);
                }
            }

            let data = smol;
            let one = "+";
            let two = "&";
            let actualFrames = [];

            for (let j = 0; j < data.length; j++) {
                let tempFrame = "";
                let frameData = data[j];
                let x = 1;
                for (let i = 1; i <= frameData.length; i += 2) {
                    if (isNaN(frameData[i - 1]) || isNaN(frameData[i])) continue;
                    for (let c = 0; c < frameData[i]; c++) {
                        if (frameData[i - 1] == 255) {
                            tempFrame += one;
                        } else {
                            tempFrame += two;
                        }
                        x++;
                        if (x == 100) {
                            x = 1;
                            tempFrame += "\n";
                        }
                    }
                }
                if (tempFrame.trim() !== "") {
                    actualFrames.push(tempFrame);
                }
            }

            console.log(`Loaded ${actualFrames.length} frames. Playing...`, "success");

            if (badAppleInterval) clearInterval(badAppleInterval);
            if (badAppleAudio) { badAppleAudio.pause(); badAppleAudio.currentTime = 0; }

            badAppleAudio = new Audio("badApple.m4a");
            badAppleAudio.play().catch(e => printToConsole("Audio play failed: " + e.message, "error"));

            let frame = 0;
            badAppleInterval = setInterval(() => {
                if (frame >= actualFrames.length) {
                    clearInterval(badAppleInterval);
                    if (badAppleAudio) badAppleAudio.pause();
                    printToConsole("Bad Apple playback finished.", "info");
                    return;
                }
                artContainer.textContent = actualFrames[frame];
                frame++;
            }, 1000 / 12.4); // 12.4 FPS

        } catch (e) {
            printToConsole("Error loading or parsing Bad Apple data: " + e.message, "error");
        }
    }

    // Background Canvas Effect
    initCanvas();
});

function initCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;

    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(100, 200, 255, 0.5)";
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // draw lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(100, 200, 255, ${1 - dist / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}