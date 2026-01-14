const puzzle = document.getElementById('puzzle');
const tiles = Array.from(puzzle.children);
const newButton = document.getElementById('new');
const resetButton = document.getElementById('reset');
const timeButton = document.getElementById('time');
const movesButton = document.getElementById('moves');

let emptyTile = tiles.find(tile => tile.classList.contains('empty'));
let moves = 0;
let timer;
let seconds = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timeButton.textContent = `TIME: ${seconds}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetGame() {
    stopTimer();
    seconds = 0;
    moves = 0;
    timeButton.textContent = 'TIME: 0s';
    movesButton.textContent = 'MOVES: 0';
    tiles.forEach(tile => puzzle.appendChild(tile));
}

function newGame() {
    resetGame();
    shuffle(tiles);
    tiles.forEach(tile => puzzle.appendChild(tile));
    emptyTile = tiles.find(tile => tile.classList.contains('empty'));
    startTimer();
}

function moveTile(tile) {
    const emptyIndex = Array.from(puzzle.children).indexOf(emptyTile);
    const tileIndex = Array.from(puzzle.children).indexOf(tile);

    const validMoves = [
        emptyIndex - 1, // left
        emptyIndex + 1, // right
        emptyIndex - 3, // up
        emptyIndex + 3  // down
    ];

    if (validMoves.includes(tileIndex)) {
        puzzle.insertBefore(tile, emptyTile);
        puzzle.insertBefore(emptyTile, puzzle.children[tileIndex]);
        moves++;
        movesButton.textContent = `MOVES: ${moves}`;
    }
}

tiles.forEach(tile => {
    tile.addEventListener('click', () => {
        if (!tile.classList.contains('empty')) {
            moveTile(tile);
        }
    });
});

newButton.addEventListener('click', newGame);
resetButton.addEventListener('click', resetGame);

newGame();