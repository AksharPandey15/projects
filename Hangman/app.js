const words = {
    'Animals': ['ELEPHANT', 'PENGUIN', 'GIRAFFE', 'KANGAROO', 'DOLPHIN'],
    'Countries': ['JAPAN', 'BRAZIL', 'FRANCE', 'AUSTRALIA', 'EGYPT'],
    'Foods': ['PIZZA', 'SUSHI', 'BURGER', 'PASTA', 'TACO'],
    'Sports': ['SOCCER', 'TENNIS', 'BASKETBALL', 'VOLLEYBALL', 'SWIMMING']
};

let word = '';
let guessedLetters = new Set();
let lives = 6;
let category = '';

const hangmanDrawings = [
    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

function initializeKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.onclick = () => guessLetter(letter);
        keyboard.appendChild(button);
    }
}

function updateDisplay() {
    // Update word display
    const wordDisplay = document.getElementById('word');
    wordDisplay.textContent = word
        .split('')
        .map(letter => guessedLetters.has(letter) ? letter : '_')
        .join(' ');

    // Update hangman drawing
    document.getElementById('hangman').textContent = hangmanDrawings[6 - lives];
    
    // Update lives
    document.getElementById('lives').textContent = lives;

    // Update keyboard
    const buttons = document.querySelectorAll('.keyboard button');
    buttons.forEach(button => {
        if (guessedLetters.has(button.textContent)) {
            button.disabled = true;
        }
    });
}

function guessLetter(letter) {
    if (guessedLetters.has(letter)) return;

    guessedLetters.add(letter);
    
    if (!word.includes(letter)) {
        lives--;
    }

    updateDisplay();
    checkGameEnd();
}

function checkGameEnd() {
    const message = document.getElementById('message');
    
    // Check for win
    if (word.split('').every(letter => guessedLetters.has(letter))) {
        message.innerHTML = 'Congratulations! You won! &#127881;';
        message.style.color = '#4CAF50';
        disableKeyboard();
    }
    
    // Check for loss
    if (lives === 0) {
        message.innerHTML = `Game Over! The word was: ${word} &#128533;`;
        message.style.color = '#f44336';
        disableKeyboard();
    }
}

function disableKeyboard() {
    const buttons = document.querySelectorAll('.keyboard button');
    buttons.forEach(button => button.disabled = true);
}

function newGame() {
    // Reset game state
    lives = 6;
    guessedLetters.clear();
    
    // Choose random category and word
    const categories = Object.keys(words);
    category = categories[Math.floor(Math.random() * categories.length)];
    const wordList = words[category];
    word = wordList[Math.floor(Math.random() * wordList.length)];
    
    // Update category display
    document.getElementById('category').querySelector('span').textContent = category;
    
    // Reset message
    document.getElementById('message').textContent = '';
    
    // Initialize keyboard and display
    initializeKeyboard();
    updateDisplay();
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const letter = event.key.toUpperCase();
    if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
        const button = Array.from(document.querySelectorAll('.keyboard button'))
            .find(btn => btn.textContent === letter);
        if (button && !button.disabled) {
            guessLetter(letter);
        }
    }
});

// Start new game when page loads
newGame(); 