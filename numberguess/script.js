let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 10;

function makeGuess() {
    const guessInput = document.getElementById("guess");
    const resultDiv = document.getElementById("result");
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        resultDiv.textContent = "Please enter a valid number between 1 and 100.";
        return;
    }

    attempts++;
    if (guess === secretNumber) {
        resultDiv.textContent = `Congratulations! You guessed it in ${attempts} attempts. The number was ${secretNumber}.`;
    } else if (guess < secretNumber) {
        resultDiv.textContent = `Too low! Attempts left: ${maxAttempts - attempts}`;
    } else {
        resultDiv.textContent = `Too high! Attempts left: ${maxAttempts - attempts}`;
    }

    if (attempts >= maxAttempts && guess !== secretNumber) {
        resultDiv.textContent = `Game over! You've used all attempts. The number was ${secretNumber}.`;
    }

    if (attempts >= maxAttempts || guess === secretNumber) {
        document.querySelector("button").disabled = true;
        guessInput.disabled = true;
    }
}

function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById("guess").value = '';
    document.getElementById("result").textContent = '';
    document.querySelector("button").disabled = false;
    document.getElementById("guess").disabled = false;
}
