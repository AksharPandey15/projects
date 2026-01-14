// DOM Elements
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workBtn = document.getElementById('work-btn');
const breakBtn = document.getElementById('break-btn');

// Timer Variables
let timerDuration = 25 * 60; // Default to 25 minutes
let isRunning = false;
let timerInterval;
let isWorkMode = true; // Start in Work mode

// Helper Functions
const updateTimerDisplay = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(remainingSeconds).padStart(2, '0');
};

const startTimer = () => {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (timerDuration > 0) {
        timerDuration--;
        updateTimerDisplay(timerDuration);
      } else {
        clearInterval(timerInterval);
        alert(isWorkMode ? 'Time for a break!' : 'Back to work!');
        toggleMode();
        resetTimer();
      }
    }, 1000);
  }
};

// New DOM Elements
const increaseBtn = document.getElementById('increase-btn');
const decreaseBtn = document.getElementById('decrease-btn');
const durationEl = document.getElementById('duration');

// Adjust Timer Duration
const adjustTimerDuration = (change) => {
  let currentDuration = parseInt(durationEl.textContent, 10);
  currentDuration += change;

  // Prevent negative or zero duration
  if (currentDuration < 1) {
    currentDuration = 1;
  }

  // Update display
  durationEl.textContent = currentDuration;

  // Update timer duration based on active mode
  if (isWorkMode) {
    timerDuration = currentDuration * 60;
  } else {
    timerDuration = currentDuration * 60;
  }

  // Reset the timer display
  updateTimerDisplay(timerDuration);
};

// Event Listeners for Adjust Buttons
increaseBtn.addEventListener('click', () => adjustTimerDuration(1));
decreaseBtn.addEventListener('click', () => adjustTimerDuration(-1));


const pauseTimer = () => {
  clearInterval(timerInterval);
  isRunning = false;
};

const resetTimer = () => {
  clearInterval(timerInterval);
  isRunning = false;
  timerDuration = isWorkMode ? 25 * 60 : 5 * 60;
  updateTimerDisplay(timerDuration);
};

const toggleMode = () => {
  isWorkMode = !isWorkMode;
  workBtn.classList.toggle('active', isWorkMode);
  breakBtn.classList.toggle('active', !isWorkMode);
  timerDuration = isWorkMode ? 25 * 60 : 5 * 60;
  resetTimer();
};

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
workBtn.addEventListener('click', () => {
  if (!isWorkMode) toggleMode();
});
breakBtn.addEventListener('click', () => {
  if (isWorkMode) toggleMode();
});

// Initialize
updateTimerDisplay(timerDuration);
