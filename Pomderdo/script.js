// Variables
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isWorkTime = true; // True if it's work time, false if it's break time
let timerInterval;

// DOM Elements
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startButton = document.getElementById('startBtn');
const resetButton = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');

// Function to start or stop the timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = 'Start';
    } else {
        timerInterval = setInterval(updateTime, 1000);
        isRunning = true;
        startButton.textContent = 'Pause';
    }
}

// Function to update the timer
function updateTime() {
    if (seconds === 0) {
        if (minutes === 0) {
            switchSession();
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }

    // Update the DOM with the new time
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
}

// Function to switch between work and break sessions
function switchSession() {
    clearInterval(timerInterval);

    if (isWorkTime) {
        minutes = 5; // 5-minute break
        statusMessage.textContent = "Take a break!";
        statusMessage.classList.add('break');
    } else {
        minutes = 25; // 25-minute work session
        statusMessage.textContent = "Time to work!";
        statusMessage.classList.remove('break');
    }

    seconds = 0;
    isWorkTime = !isWorkTime;
    updateTime();
    isRunning = false;
    startButton.textContent = 'Start';
}

// Function to format time to be always two digits (e.g., "09" instead of "9")
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    minutes = 25;
    seconds = 0;
    isRunning = false;
    isWorkTime = true;
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
    statusMessage.textContent = "Time to work!";
    statusMessage.classList.remove('break');
    startButton.textContent = 'Start';
}

// Event Listeners
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);

// Initial Timer Update
minutesElement.textContent = formatTime(minutes);
secondsElement.textContent = formatTime(seconds);
