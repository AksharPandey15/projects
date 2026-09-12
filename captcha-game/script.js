const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('steering-slider');
const progressBar = document.getElementById('progress-bar');
const uiOverlay = document.getElementById('ui-overlay');
const uiMessage = document.getElementById('ui-message');
const retryBtn = document.getElementById('retry-btn');

// Adjust logical canvas size
canvas.width = 400;
canvas.height = 500;

// Game Constants
const LANES = 4;
const LANE_WIDTH = 70;
const ROAD_WIDTH = LANES * LANE_WIDTH;
const MARGIN = (canvas.width - ROAD_WIDTH) / 2; // Grass + Shoulder
const GAME_DURATION = 15000; // 15 seconds to win
const PLAYER_Y = canvas.height - 120;
const CAR_WIDTH = 36;
const CAR_HEIGHT = 70;

// Palettes
const COLORS = {
    grass: '#9eb474',
    grassDark: '#8a9e65',
    shoulder: '#d9d9d9',
    curb: '#a0a0a0',
    road: '#949494',
    lines: '#e6e6e6',
    player: '#5582f3',
    shadow: 'rgba(0, 0, 0, 0.4)'
};

// Added custom colors just for semi-cabs
const TRAFFIC_COLORS = ['#333333', '#e6e6e6', '#2b4b7c', '#a4a4a4', '#b83b3b'];
const SEMI_CAB_COLORS = ['#b83b3b', '#2b4b7c', '#1a5c28', '#d4a017'];
const VEHICLE_TYPES = ['sedan', 'suv', 'pickup', 'semi'];

// State
let gameState = 'playing'; // playing, won, lost
let startTime = 0;
let lastTime = 0;
let distance = 0;
let speed = 300; // pixels per second
let obstacles = [];
let particles = [];
let spawnTimer = 0;
let reqId;
let emergencyTimeout = null;

class Car {
    constructor(x, y, color, type = 'sedan') {
        this.x = x;
        this.y = y;
        this.width = CAR_WIDTH;
        // Make semi trucks massive (3x standard length)
        this.height = type === 'semi' ? CAR_HEIGHT * 3 : (type === 'suv' || type === 'pickup' ? CAR_HEIGHT + 10 : CAR_HEIGHT);
        this.color = color;
        this.type = type;
        this.lane = Math.floor((this.x - MARGIN) / LANE_WIDTH);
        this.speedY = 0; // Relative to road
        this.speedX = 0;
        this.targetLane = this.lane;
        this.turnSignal = 0; // -1 left, 0 off, 1 right
        this.signalTimer = 0;
        this.crashed = false;
    }

    draw(ctx) {
        // Shadow
        ctx.fillStyle = COLORS.shadow;
        roundRect(ctx, this.x + 4, this.y + 4, this.width, this.height, 4);

        if (this.type === 'semi' || this.type === 'firetruck') {
            const isFire = this.type === 'firetruck';

            // Trailer Base
            ctx.fillStyle = isFire ? '#c00' : '#e6e6e6';
            roundRect(ctx, this.x, this.y + 34, this.width, this.height - 34, 2);

            // Trailer Roof Detailing (ribs/panels)
            ctx.fillStyle = isFire ? '#e00' : '#d0d0d0';
            for (let ty = this.y + 45; ty < this.y + this.height - 15; ty += 20) {
                ctx.fillRect(this.x + 4, ty, this.width - 8, 3);
            }

            // Cab
            ctx.fillStyle = isFire ? '#f00' : this.color;
            roundRect(ctx, this.x + 2, this.y, this.width - 4, 30, 4);

            // Windshield
            ctx.fillStyle = '#222';
            ctx.fillRect(this.x + 4, this.y + 10, this.width - 8, 8);

            // Headlights
            ctx.fillStyle = '#ffa';
            ctx.fillRect(this.x + 4, this.y, 6, 3);
            ctx.fillRect(this.x + this.width - 10, this.y, 6, 3);

            // Taillights
            ctx.fillStyle = '#f00';
            ctx.fillRect(this.x + 2, this.y + this.height - 4, 8, 4);
            ctx.fillRect(this.x + this.width - 10, this.y + this.height - 4, 8, 4);

        } else {
            // Standard Body
            ctx.fillStyle = this.type === 'police' ? '#111' : this.color;
            roundRect(ctx, this.x, this.y, this.width, this.height, 4);

            // Roof
            ctx.fillStyle = this.type === 'police' ? '#eee' : adjustColor(this.color, 20);
            roundRect(ctx, this.x + 4, this.y + 15, this.width - 8, this.height - 30, 2);

            // Windows
            ctx.fillStyle = '#222';
            // Windshield
            ctx.fillRect(this.x + 4, this.y + 12, this.width - 8, 8);

            // Rear window / Truck bed
            if (this.type === 'pickup') {
                ctx.fillRect(this.x + 4, this.y + 35, this.width - 8, 6);
                ctx.fillStyle = '#111';
                ctx.fillRect(this.x + 4, this.y + 45, this.width - 8, this.height - 50);
            } else {
                ctx.fillRect(this.x + 4, this.y + this.height - 20, this.width - 8, 8);
            }

            // Taillights
            ctx.fillStyle = '#f00';
            ctx.fillRect(this.x + 2, this.y + this.height - 4, 8, 4);
            ctx.fillRect(this.x + this.width - 10, this.y + this.height - 4, 8, 4);

            // Headlights
            ctx.fillStyle = '#ffa';
            ctx.fillRect(this.x + 2, this.y, 6, 3);
            ctx.fillRect(this.x + this.width - 8, this.y, 6, 3);
        }

        // Emergency Sirens
        if (this.behavior === 'emergency') {
            this.signalTimer += 16;
            let flash = (this.signalTimer % 400 < 200);
            ctx.fillStyle = flash ? '#f00' : '#00f';
            ctx.fillRect(this.x + 6, this.y + 20, 8, 4);
            ctx.fillStyle = flash ? '#00f' : '#f00';
            ctx.fillRect(this.x + this.width - 14, this.y + 20, 8, 4);
        }

        // Turn Signals
        if (this.turnSignal !== 0) {
            this.signalTimer += 16;
            if (this.signalTimer % 600 < 300) {
                ctx.fillStyle = '#fa0';
                if (this.turnSignal === -1) { // Left
                    ctx.fillRect(this.x + 2, this.y + this.height - 4, 8, 4);
                } else if (this.turnSignal === 1) { // Right
                    ctx.fillRect(this.x + this.width - 10, this.y + this.height - 4, 8, 4);
                }
            }
        }
    }

    getRect() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

class Player extends Car {
    constructor() {
        const startX = MARGIN + LANE_WIDTH * 1.5 - CAR_WIDTH / 2;
        super(startX, PLAYER_Y, COLORS.player, 'sedan');
    }

    update(dt) {
        const sliderVal = slider.value / 100;
        const minX = MARGIN + 5;
        const maxX = canvas.width - MARGIN - this.width - 5;
        const targetX = minX + sliderVal * (maxX - minX);

        this.x += (targetX - this.x) * 15 * dt;

        if (this.x < minX) this.x = minX;
        if (this.x > maxX) this.x = maxX;
    }
}

let player = new Player();

function spawnTraffic() {
    const lane = Math.floor(Math.random() * LANES);
    const laneX = MARGIN + (lane * LANE_WIDTH) + (LANE_WIDTH / 2) - (CAR_WIDTH / 2);
    const type = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];

    // Semis need much more spawn clearance due to length
    const requiredClearance = type === 'semi' ? CAR_HEIGHT * 4 : CAR_HEIGHT * 2;

    const safe = obstacles.every(obs => {
        if (obs.lane === lane && obs.y < requiredClearance) return false;
        return true;
    });

    if (!safe) return;

    let color = TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)];
    if (type === 'semi') {
        color = SEMI_CAB_COLORS[Math.floor(Math.random() * SEMI_CAB_COLORS.length)];
    }

    let aiCar = new Car(laneX, -CAR_HEIGHT * 3, color, type);
    aiCar.lane = lane;

    if (type === 'semi') {
        // Semi-truck specific behavior: Slow, heavy, acts as a huge blockade
        aiCar.speedY = -speed * 0.4;
        aiCar.behavior = 'cautious';
    } else {
        // Randomize speed behavior for regular cars
        const rand = Math.random();
        if (rand < 0.30) {
            aiCar.speedY = speed * 0.8;
            aiCar.behavior = 'reckless';
            aiCar.color = '#ff3300';
        } else if (rand < 0.5) {
            aiCar.speedY = -speed * 0.2;
            aiCar.behavior = 'cautious';
        } else {
            aiCar.speedY = speed * 0.1 - Math.random() * speed * 0.2;
            aiCar.behavior = 'normal';
        }
    }

    obstacles.push(aiCar);
}

function updateAI(ai, dt) {
    ai.y += (speed - ai.speedY) * dt;

    let carAhead = null;
    let distAhead = Infinity;

    obstacles.forEach(other => {
        if (other !== ai && other.lane === ai.lane && other.y > ai.y) {
            const d = other.y - ai.y;
            if (d < distAhead) {
                distAhead = d;
                carAhead = other;
            }
        }
    });

    if (ai.behavior === 'reckless' && ai.targetLane === ai.lane && distAhead > CAR_HEIGHT * 4) {
        if (Math.random() < 0.05) {
            const possibleLanes = [];
            if (ai.lane > 0) possibleLanes.push(ai.lane - 1);
            if (ai.lane < LANES - 1) possibleLanes.push(ai.lane + 1);
            if (possibleLanes.length > 0) {
                ai.targetLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                ai.turnSignal = Math.sign(ai.targetLane - ai.lane);
            }
        }
    }

    if (distAhead < CAR_HEIGHT * 4) {
        if (ai.behavior === 'reckless') {
            ai.speedY -= 20 * dt;
            if (ai.targetLane === ai.lane) {
                const possibleLanes = [];
                if (ai.lane > 0) possibleLanes.push(ai.lane - 1);
                if (ai.lane < LANES - 1) possibleLanes.push(ai.lane + 1);

                if (possibleLanes.length > 0) {
                    ai.targetLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                    ai.turnSignal = Math.sign(ai.targetLane - ai.lane);
                }
            }
        } else if (ai.behavior === 'emergency') {
            if (ai.targetLane === ai.lane) {
                const possibleLanes = [];
                if (ai.lane > 0) possibleLanes.push(ai.lane - 1);
                if (ai.lane < LANES - 1) possibleLanes.push(ai.lane + 1);

                if (possibleLanes.length > 0) {
                    ai.targetLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                    ai.turnSignal = 0;
                }
            }
            if (distAhead < CAR_HEIGHT * 2) {
                ai.speedY -= 100 * dt;
            }
        } else {
            // Semi-trucks and cautious drivers brake harder
            const brakePower = ai.type === 'semi' ? 40 : 25;
            ai.speedY -= brakePower * dt;
            if (ai.speedY < carAhead?.speedY) ai.speedY = (carAhead?.speedY || 0);
        }
    }

    // Lane Changing Logic
    if (ai.targetLane !== ai.lane) {
        const targetX = MARGIN + (ai.targetLane * LANE_WIDTH) + (LANE_WIDTH / 2) - (CAR_WIDTH / 2);
        const dir = Math.sign(targetX - ai.x);

        // Semis change lanes much slower
        const turnSpeed = ai.type === 'semi' ? 40 : 100;
        ai.x += dir * turnSpeed * dt;

        if (Math.abs(ai.x - targetX) < 2) {
            ai.x = targetX;
            ai.lane = ai.targetLane;
            ai.turnSignal = 0;
        }
    }
}

function checkCollision(r1, r2) {
    const shrink = 4;
    return !(r2.left > r1.right - shrink ||
        r2.right < r1.left + shrink ||
        r2.top > r1.bottom - shrink ||
        r2.bottom < r1.top + shrink);
}

function createCrashParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            type: 'spark',
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 1.0,
            color: Math.random() > 0.5 ? '#ffaa00' : '#ff4400',
            size: Math.random() * 6 + 2
        });
    }
    for (let i = 0; i < 15; i++) {
        particles.push({
            type: 'debris',
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 500,
            vy: (Math.random() - 0.5) * 300,
            life: 1.5,
            color: '#333333',
            size: Math.random() * 5 + 3
        });
    }
    for (let i = 0; i < 12; i++) {
        particles.push({
            type: 'smoke',
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() - 0.5) * 40,
            life: 1.0,
            color: '#666666',
            size: 15 + Math.random() * 20
        });
    }
}

function drawBackground(offset) {
    ctx.fillStyle = COLORS.grass;
    ctx.fillRect(0, 0, MARGIN, canvas.height);
    ctx.fillRect(canvas.width - MARGIN, 0, MARGIN, canvas.height);

    ctx.fillStyle = COLORS.grassDark;
    for (let i = 0; i < canvas.height; i += 20) {
        const y = (i + offset) % canvas.height;
        ctx.fillRect(10, y, 5, 5);
        ctx.fillRect(30, y + 10, 5, 5);
        ctx.fillRect(canvas.width - 20, y + 5, 5, 5);
        ctx.fillRect(canvas.width - 40, y + 15, 5, 5);
    }

    ctx.fillStyle = COLORS.shoulder;
    ctx.fillRect(MARGIN - 10, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - MARGIN, 0, 10, canvas.height);

    ctx.fillStyle = COLORS.curb;
    ctx.fillRect(MARGIN - 2, 0, 2, canvas.height);
    ctx.fillRect(canvas.width - MARGIN, 0, 2, canvas.height);

    ctx.fillStyle = COLORS.road;
    ctx.fillRect(MARGIN, 0, ROAD_WIDTH, canvas.height);

    ctx.fillStyle = COLORS.lines;
    for (let i = 1; i < LANES; i++) {
        const x = MARGIN + i * LANE_WIDTH - 2;
        for (let y = -40; y < canvas.height + 40; y += 80) {
            const drawY = (y + offset) % 80;
            ctx.fillRect(x, (Math.floor(y / 80) * 80) + drawY, 4, 40);
        }
    }
}

function drawParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.type === 'debris') {
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.life -= dt * 0.7;
        } else if (p.type === 'smoke') {
            p.size += dt * 40;
            p.life -= dt * 0.5;
        } else {
            p.life -= dt * 2;
        }

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.globalAlpha = p.type === 'smoke' ? p.life * 0.6 : p.life;
        ctx.fillStyle = p.color;
        if (p.type === 'smoke') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
    }
    ctx.globalAlpha = 1.0;
}

function gameLoop(timestamp) {
    if (!startTime) {
        startTime = timestamp;
        lastTime = timestamp;
    }
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    if (gameState === 'playing') {
        distance += speed * dt;

        spawnTimer -= dt;
        if (spawnTimer <= 0) {
            spawnTraffic();
            spawnTimer = 0.5 + Math.random() * 1.5;
        }

        player.update(dt);

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];

            if (obs.crashed) {
                obs.y += speed * dt;
            } else {
                updateAI(obs, dt);

                for (let j = 0; j < obstacles.length; j++) {
                    if (i !== j && !obstacles[j].crashed) {
                        if (checkCollision(obs.getRect(), obstacles[j].getRect())) {
                            obs.crashed = true;
                            obstacles[j].crashed = true;
                            obs.color = '#333';
                            obstacles[j].color = '#333';
                            obs.turnSignal = 0;
                            obstacles[j].turnSignal = 0;
                            createCrashParticles(obs.x + obs.width / 2, obs.y + obs.height / 2);
                            spawnEmergency();
                        }
                    }
                }
            }

            // Allow more clearance offscreen for Semis
            if (obs.y > canvas.height + 200 || obs.y < -CAR_HEIGHT * 6) {
                obstacles.splice(i, 1);
                continue;
            }

            if (checkCollision(player.getRect(), obs.getRect())) {
                gameState = 'lost';
                createCrashParticles(player.x + player.width / 2, player.y);
                showUI("Crash!\nVerification Failed.", true);
            }
        }
    }

    const roadOffset = distance % 80;
    drawBackground(roadOffset);

    obstacles.forEach(obs => obs.draw(ctx));
    player.draw(ctx);

    if (gameState === 'lost') {
        drawParticles(dt);
    }

    reqId = requestAnimationFrame(gameLoop);
}

function showUI(msg, showRetry) {
    uiMessage.innerText = msg;
    uiOverlay.classList.remove('hidden');
    if (showRetry) {
        retryBtn.classList.remove('hidden');
    } else {
        retryBtn.classList.add('hidden');
    }
}

function hideUI() {
    uiOverlay.classList.add('hidden');
    retryBtn.classList.add('hidden');
}

function resetGame() {
    gameState = 'playing';
    startTime = performance.now();
    lastTime = performance.now();
    distance = 0;
    obstacles = [];
    particles = [];
    player = new Player();
    slider.value = 50;
    hideUI();
}

function spawnEmergency() {
    if (gameState !== 'playing') return;

    const policeLane = Math.floor(Math.random() * LANES);
    const fireLane = Math.floor(Math.random() * LANES);

    const policeX = MARGIN + (policeLane * LANE_WIDTH) + (LANE_WIDTH / 2) - (CAR_WIDTH / 2);
    let police = new Car(policeX, -CAR_HEIGHT * 2, '#fff', 'police');
    police.lane = policeLane;
    police.speedY = 0;
    police.behavior = 'emergency';
    obstacles.push(police);

    if (emergencyTimeout) clearTimeout(emergencyTimeout);
    emergencyTimeout = setTimeout(() => {
        if (gameState !== 'playing') return;
        const ftX = MARGIN + (fireLane * LANE_WIDTH) + (LANE_WIDTH / 2) - (CAR_WIDTH / 2);
        let ft = new Car(ftX, -CAR_HEIGHT * 4, '#f00', 'firetruck');
        ft.lane = fireLane;
        ft.speedY = 0;
        ft.behavior = 'emergency';
        obstacles.push(ft);
    }, 1500);
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

retryBtn.addEventListener('click', resetGame);

window.addEventListener('keydown', (e) => {
    if (gameState !== 'playing') return;
    const step = 5;
    let val = parseInt(slider.value);
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        slider.value = Math.max(0, val - step);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        slider.value = Math.min(100, val + step);
    }
});

reqId = requestAnimationFrame(gameLoop);