const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Function to set canvas size based on device width and height
function setCanvasSize() {
    canvas.width = window.innerWidth * 0.9; // Set canvas width to 90% of window width
    canvas.height = window.innerHeight * 0.9; // Set canvas height to 90% of window height
}

// Call the function to set canvas size initially
setCanvasSize();

// Call the function to set canvas size whenever the window is resized
window.addEventListener('resize', setCanvasSize);

// Set up the screen dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Set up the ball properties
const BALL_RADIUS = 20;
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballVelocityX = 0; // Initialize with 0 velocity
let ballVelocityY = 0; // Initialize with 0 velocity

// Set up the board properties
const BOARD_WIDTH = 100;
const BOARD_HEIGHT = 20;
let boardX = WIDTH / 2 - BOARD_WIDTH / 2;
const boardY = HEIGHT - BOARD_HEIGHT - 10;
let boardVelocity = 0;

// Variable to track whether the game has started
let gameStarted = false;

// Variable to track game over state
let gameOver = false;

// Score counter
let score = 0;

// Function to restart the game
function restartGame() {
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballVelocityX = 0; // Reset ball velocity
    ballVelocityY = 0; // Reset ball velocity
    boardX = WIDTH / 2 - BOARD_WIDTH / 2;
    boardVelocity = 0;
    gameStarted = false; // Reset game start status
    gameOver = false; // Reset game over status
    score = 0; // Reset score
}

// Function to draw the score on the canvas
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 8, 20);
}

// Main game loop
function gameLoop() {
    // If the game is over, display restart button and score
    if (gameOver) {
        document.getElementById("restartButton").style.display = "block";
        document.getElementById("score").innerText = "Score: " + score;
        return;
    }

    // If the game hasn't started, wait for player input
    if (!gameStarted) {
        // Clear the canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Draw the ball at the starting position
        ctx.beginPath();
        ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.closePath();

        // Draw the board
        ctx.beginPath();
        ctx.rect(boardX, boardY, BOARD_WIDTH, BOARD_HEIGHT);
        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.closePath();

        // Return and wait for player input
        requestAnimationFrame(gameLoop);
        return;
    }

    // Update board position
    boardX += boardVelocity;

    // Ensure the board stays within the boundaries of the screen
    if (boardX < 0) {
        boardX = 0;
    } else if (boardX > WIDTH - BOARD_WIDTH) {
        boardX = WIDTH - BOARD_WIDTH;
    }

    // Update ball position
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Check for collisions with walls
    if (ballX <= 0 + BALL_RADIUS || ballX >= WIDTH - BALL_RADIUS) {
        ballVelocityX = -ballVelocityX;
    }
    if (ballY <= 0 + BALL_RADIUS) {
        ballVelocityY = -ballVelocityY;
    }

    // Check for collision with the board
    if (ballY >= boardY - BALL_RADIUS && boardX <= ballX && ballX <= boardX + BOARD_WIDTH) {
        ballVelocityY = -ballVelocityY;
        score++; // Increment score when ball hits the board
    }

    // Check for collision with bottom wall
    if (ballY >= HEIGHT - BALL_RADIUS) {
        // Game over
        gameOver = true;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw the score
    drawScore();

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();

    // Draw the board
    ctx.beginPath();
    ctx.rect(boardX, boardY, BOARD_WIDTH, BOARD_HEIGHT);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(gameLoop);
}

// Function to start the game
function startGame() {
    gameStarted = true;
    // Set initial velocity for the ball
    ballVelocityX = 5;
    ballVelocityY = 7;
}

// Start the game loop
gameLoop();

// Event listeners for controlling board movement
document.addEventListener("keydown", function(event) {
    if (!gameStarted && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        startGame();
    }

    if (event.key === "ArrowLeft") {
        boardVelocity = -5;
    } else if (event.key === "ArrowRight") {
        boardVelocity = 5;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        boardVelocity = 0;
    }
});

// Touch controls for mobile devices
let touchStartX = 0;
canvas.addEventListener("touchstart", function(event) {
    if (!gameStarted) {
        startGame();
    }
    touchStartX = event.touches[0].clientX;
});

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();
    let touchX = event.touches[0].clientX;
    let movementX = touchX - touchStartX;
    boardX += movementX;
    touchStartX = touchX;
    if (boardX < 0) {
        boardX = 0;
    } else if (boardX > WIDTH - BOARD_WIDTH) {
        boardX = WIDTH - BOARD_WIDTH;
    }
});

// Event listener for restarting the game
document.getElementById("restartButton").addEventListener("click", function() {
    restartGame();
    document.getElementById("restartButton").style.display = "none";
    gameLoop(); // Start the game loop again after restarting
});
