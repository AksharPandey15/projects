//board
let board;
let context;
const birdFont = new FontFace('Flappy Regular', 'url(flappy-font.ttf)');

birdFont.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
    console.log("Font loaded successfully!");
}).catch(function(error) {
    console.error("Failed to load font:", error);
});

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX;
let birdY;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = 0;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function() {
    let jumpSound = document.getElementById("jumpSound");
let scoreSound = document.getElementById("scoreSound");
let hitSound = document.getElementById("hitSound");
let dieSound = document.getElementById("dieSound");
let bgm = document.getElementById("bgm");
console.log(jumpSound, scoreSound, hitSound, dieSound);
    // Set the board to be fullscreen
    board = document.getElementById("board");
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    context = board.getContext("2d");

    // Set bird's initial position
    birdX = board.width / 8;
    birdY = board.height / 2;
    bird.x = birdX;
    bird.y = birdY;


    // Load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";


    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Limit bird.y to the top of the screen
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; 
            scoreSound.play()
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            hitSound.play()
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font = "60px 'Flappy Regular', sans-serif";
    context.fillText(score, board.width * 0.05, board.height * 0.1);


    if (gameOver) {
        dieSound.play()
        // Game Over (Centered and Red)
        context.fillStyle = "red";
        context.font = "60px 'Flappy Regular', sans-serif";
        context.textAlign = "center";  // Center align text horizontally
        context.textBaseline = "middle";  // Center align text vertically
        context.fillText("GAME OVER. Press Space To Start", board.width / 2, board.height / 2);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img : topPipeImg,
        x : board.width,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : board.width,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;
        jumpSound.play(); // Play jump sound
        bgm.play()


        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x && 
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}
