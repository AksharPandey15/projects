var playerTurn, moves, isGameOver, span, restartButton;
playerTurn = "x";
moves = 0;
isGameOver = false;
span = document.getElementsByTagName("span");
restartButton = '<button onclick="playAgain()"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg></button>';

function play(y) {
    if (y.dataset.player === "none" && !isGameOver) {
        y.innerHTML = playerTurn;
        y.dataset.player = playerTurn;
        moves++;
        playerTurn = playerTurn === "x" ? "o" : "x";

        // Check for winners
        checkWinner(1, 2, 3);
        checkWinner(4, 5, 6);
        checkWinner(7, 8, 9);
        checkWinner(1, 4, 7);
        checkWinner(2, 5, 8);
        checkWinner(3, 6, 9);
        checkWinner(1, 5, 9);
        checkWinner(3, 5, 7);

        // Check for draw
        if (moves === 9 && !isGameOver) {
            draw();
        }
    }
}

function checkWinner(a, b, c) {
    a--;
    b--;
    c--;
    if (span[a].dataset.player === span[b].dataset.player &&
        span[b].dataset.player === span[c].dataset.player &&
        span[a].dataset.player !== "none") {
        span[a].parentNode.classList.add("activeBox");
        span[b].parentNode.classList.add("activeBox");
        span[c].parentNode.classList.add("activeBox");
        gameOver(a);
    }
}

function playAgain() {
    document.querySelector(".alert")?.remove();
    resetGame();
    isGameOver = false;
    Array.from(span).forEach(box => {
        box.parentNode.classList.remove("activeBox");
        box.classList.remove("correctMove");
    });
}

function resetGame() {
    Array.from(span).forEach(box => {
        box.dataset.player = "none";
        box.innerHTML = "&nbsp;";
    });
    playerTurn = "x";
}

function gameOver(a) {
    const winningPlayer = span[a].dataset.player;
    const losingPlayer = winningPlayer === "x" ? "o" : "x";
    const optimalMoves = findOptimalMoves(losingPlayer);

    // Replay the game with the correct moves
    replayGame(optimalMoves.correctMoves);

    const gameOverAlertElement = `<b>GAME OVER</b><br><br> Player ${winningPlayer.toUpperCase()} Wins!!!<br><br>Try these moves to win next time:<br>${optimalMoves.suggestions}<br><br>${restartButton}`;
    const div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = gameOverAlertElement;
    document.body.appendChild(div);
    isGameOver = true;
    moves = 0;
}

function draw() {
    const drawAlertElement = `<b>DRAW!!!</b><br><br>${restartButton}`;
    const div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = drawAlertElement;
    document.body.appendChild(div);
    isGameOver = true;
    moves = 0;
}

function findOptimalMoves(player) {
    const winningPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let optimalMoves = {
        suggestions: "",
        correctMoves: []
    };

    for (let pattern of winningPatterns) {
        let count = 0;
        let emptySpaces = [];

        for (let index of pattern) {
            if (span[index].dataset.player === player) {
                count++;
            } else if (span[index].dataset.player === "none") {
                emptySpaces.push(index);
            }
        }

        if (count === 2 && emptySpaces.length === 1) {
            optimalMoves.suggestions += `Place ${player.toUpperCase()} at position ${emptySpaces[0] + 1} to win.<br>`;
            optimalMoves.correctMoves.push(emptySpaces[0]);
            span[emptySpaces[0]].classList.add("suggestedMove");
        }
    }

    return optimalMoves;
}

function replayGame(correctMoves) {
    let moveIndex = 0;
    const replayInterval = setInterval(() => {
        if (moveIndex < correctMoves.length) {
            const move = correctMoves[moveIndex];
            span[move].innerHTML = "x"; // Assume "x" is the winning player for the replay
            span[move].dataset.player = "x";
            span[move].classList.add("correctMove");
            moveIndex++;
        } else {
            clearInterval(replayInterval);
        }
    }, 1000);
}
