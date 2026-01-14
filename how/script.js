// Game state
let playerScore = 0;
let computerScore = 0;
let gameHistory = [];
let currentDifficulty = 'medium';
let gameMode = 'ai'; // 'ai' or 'online'
let gameId = null;
let playerId = null;

// Modified handleMove function to work with both modes
function handleMove(choice) {
    if (gameMode === 'ai') {
        playGame(choice);
    } else {
        makeOnlineMove(choice);
    }
}
function createOnlineGame() {
    // First check if we have database connection
    if (!database || !database.ref) {
        alert('Cannot connect to game server. Please check your internet connection.');
        return;
    }

    playerId = 'player1';
    gameId = Math.random().toString(36).substring(2, 15);
    
    const gameRef = database.ref(`games/${gameId}`);
    
    // Add error handling and connection verification
    gameRef.set({
        status: 'waiting',
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        player1: {
            connected: true,
            choice: null
        },
        player2: {
            connected: false,
            choice: null
        },
        result: null
    }).then(() => {
        return gameRef.once('value');
    }).then((snapshot) => {
        if (!snapshot.exists()) {
            throw new Error('Game creation failed');
        }
        
        document.getElementById('gameCode').textContent = `Game Code: ${gameId}`;
        document.getElementById('onlineStatus').textContent = 'Waiting for opponent...';
        
        // Set up connection monitoring
        const connectedRef = database.ref('.info/connected');
        connectedRef.on('value', (snap) => {
            if (snap.val() === true) {
                // We're connected (or reconnected)
                gameRef.child('player1').update({ connected: true });
                
                // When we disconnect, remove the game
                gameRef.onDisconnect().remove();
            } else {
                document.getElementById('onlineStatus').textContent = 'Connecting...';
            }
        });

        listenToGame(gameId);
    }).catch((error) => {
        console.error('Game creation error:', error);
        alert('Failed to create game. Please try again.');
        gameId = null;
        playerId = null;
    });
}

function joinGame() {
    const code = document.getElementById('joinGameInput').value.trim();
    if (!code) {
        alert('Please enter a game code');
        return;
    }

    // First check if the game exists
    database.ref(`games/${code}`).once('value', (snapshot) => {
        const gameData = snapshot.val();
        if (!gameData) {
            alert('Game not found!');
            return;
        }
        
        if (gameData.player2.connected) {
            alert('Game is full!');
            return;
        }

        // If game exists and player2 slot is open, join the game
        gameId = code;
        playerId = 'player2';
        
        const gameRef = database.ref(`games/${gameId}`);
        gameRef.child('player2').update({
            connected: true
        });
        gameRef.update({
            status: 'ready'
        });

        document.getElementById('onlineStatus').textContent = 'Connected! Game ready.';
        listenToGame(gameId);
    });
}

function listenToGame(gameId) {
    const gameRef = database.ref(`games/${gameId}`);
    
    // Remove any existing listeners first
    gameRef.off();
    
    gameRef.on('value', (snapshot) => {
        const gameData = snapshot.val();
        if (!gameData) {
            console.log('No game data found');
            return;
        }

        updateOnlineGameUI(gameData);
        
        // Check for both players' choices
        if (gameData.player1.choice && gameData.player2.choice) {
            determineWinner(gameData);
        }
    });
}

function makeOnlineMove(choice) {
    if (!gameId || !playerId) {
        alert('Not connected to a game!');
        return;
    }
    
    const gameRef = database.ref(`games/${gameId}`);
    gameRef.child(playerId).update({
        choice: choice
    });

    document.getElementById('onlineStatus').textContent = 'Move made! Waiting for opponent...';
}

function determineWinner(gameData) {
    const p1Choice = gameData.player1.choice;
    const p2Choice = gameData.player2.choice;
    
    let result;
    if (p1Choice === p2Choice) {
        result = "It's a tie!";
    } else if (
        (p1Choice === 'rock' && p2Choice === 'scissors') ||
        (p1Choice === 'paper' && p2Choice === 'rock') ||
        (p1Choice === 'scissors' && p2Choice === 'paper')
    ) {
        result = "Player 1 wins!";
    } else {
        result = "Player 2 wins!";
    }
    
    database.ref(`games/${gameId}`).update({
        result: result,
        status: 'finished'
    });
}

function updateOnlineGameUI(gameData) {
    const statusDisplay = document.getElementById('onlineStatus');
    const resultDisplay = document.getElementById('result');
    
    switch(gameData.status) {
        case 'waiting':
            statusDisplay.textContent = 'Waiting for opponent...';
            break;
        case 'ready':
            statusDisplay.textContent = 'Game ready! Make your move.';
            break;
        case 'finished':
            statusDisplay.textContent = 'Game finished! Starting new round...';
            break;
    }
    
    if (gameData.result) {
        resultDisplay.textContent = gameData.result;
        
        // Reset after showing result
        setTimeout(() => {
            database.ref(`games/${gameId}`).update({
                'player1/choice': null,
                'player2/choice': null,
                result: null,
                status: 'ready'
            });
        }, 3000);
    }

    // Show current choices (for debugging)
    console.log('Player 1 choice:', gameData.player1.choice);
    console.log('Player 2 choice:', gameData.player2.choice);
}

function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('aiMode').style.display = mode === 'ai' ? 'block' : 'none';
    document.getElementById('onlineMode').style.display = mode === 'online' ? 'block' : 'none';
}

// Pattern analysis for hard mode
function analyzePlayerPatterns() {
    if (gameHistory.length < 3) return getRandomChoice();
    
    // Look for patterns in last few moves
    const lastMoves = gameHistory.slice(-3).map(game => game.playerChoice);
    
    // Check if player repeats moves
    if (lastMoves[1] === lastMoves[2]) {
        // Predict they might change their move
        return getCounterMove(getCounterMove(lastMoves[2]));
    }
    
    // Check if player alternates between two moves
    if (lastMoves[0] === lastMoves[2]) {
        return getCounterMove(lastMoves[2]);
    }
    
    return getRandomChoice();
}

// Get counter move
function getCounterMove(move) {
    const counters = {
        'rock': 'paper',
        'paper': 'scissors',
        'scissors': 'rock'
    };
    return counters[move];
}

// Get random choice
function getRandomChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// Get computer's choice based on difficulty
function getComputerChoice(playerChoice) {
    switch(currentDifficulty) {
        case 'easy':
            // 30% chance to make a mistake
            if (Math.random() < 0.3) {
                return getRandomChoice();
            }
            return getCounterMove(getCounterMove(playerChoice));
            
        case 'medium':
            // Random choice
            return getRandomChoice();
            
        case 'hard':
            // Use pattern analysis
            return analyzePlayerPatterns();
            
        case 'impossible':
            // Always win
            return getCounterMove(playerChoice);
            
        default:
            return getRandomChoice();
    }
}

// Play round
function playRound(playerChoice) {
    const computerChoice = getComputerChoice(playerChoice);
    
    // Store game history
    gameHistory.push({
        playerChoice: playerChoice,
        computerChoice: computerChoice
    });
    
    // Determine winner
    if (playerChoice === computerChoice) {
        return {
            result: "It's a tie!",
            computerChoice: computerChoice
        };
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        playerScore++;
        return {
            result: `You win! ${playerChoice} beats ${computerChoice}`,
            computerChoice: computerChoice
        };
    } else {
        computerScore++;
        return {
            result: `You lose! ${computerChoice} beats ${playerChoice}`,
            computerChoice: computerChoice
        };
    }
}

// Set difficulty
function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    // Reset scores when changing difficulty
    playerScore = 0;
    computerScore = 0;
    gameHistory = [];
    updateDisplay('Select your move!');
}

// Play game
function playGame(playerChoice) {
    const roundResult = playRound(playerChoice);
    updateDisplay(roundResult.result);
}

// Update display
function updateDisplay(result) {
    document.getElementById('result').textContent = result;
    document.getElementById('score').textContent = 
        `Score - You: ${playerScore} Computer: ${computerScore}`;
}

// Add disconnect handling
window.addEventListener('beforeunload', () => {
    if (gameId && playerId) {
        database.ref(`games/${gameId}/${playerId}`).update({
            connected: false
        });
    }
});