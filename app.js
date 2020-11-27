// document.querySelector('#settingsCollapseButton').click();

var canvas = document.getElementById("the_canvas")
var ctx = canvas.getContext("2d");

// Declaring/defining the variables
var score = 0;
var originalLives = 3;
var lives = originalLives;

var speed = 7.5;

var isPaused = false;

var ballRadius = 15;
var paddleWidth = 100;
var paddleHeight = 15;

var x = canvas.width / 2;
var y = canvas.height * 0.85;
var paddlePosition = (canvas.width - paddleWidth) / 2;

var dx = 2;
var dy = -2;

var leftArrowPressed = false;
var rightArrowPressed = false;

var brickRowCount = 5;
var brickColumnCount = 10;
var brickWidth = 100;
var brickHeight = 30;
var brickPadding = 20;
var brickOffsetTop = 50;
var brickOffsetLeft = (canvas.width - (brickWidth * brickColumnCount) - (brickPadding * (brickColumnCount - 1))) / 2;

var bricks = [];
for (var i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
        bricks[i][j] = {x : 0, y : 0, status : 1}
    }
}

// The drawing functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = "#3281a8";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlePosition, (canvas.height * 0.85 + ballRadius), paddleWidth, paddleHeight);
    ctx.fillStyle = "#32a852";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var i = 0; i < brickColumnCount; i++) {
        for (var j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status == 1) {
                var brickPositionX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickPositionY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[i][j].x = brickPositionX;
                bricks[i][j].y = brickPositionY;
                ctx.beginPath();
                ctx.rect(brickPositionX, brickPositionY, brickWidth, brickHeight);
                ctx.fillStyle = "#fcba03";
                ctx.fill();
                ctx.closePath();
            }
            
        }
    }
}

function printScore() {
    ctx.font = "20px Monaco";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 15, 30);
}

function printLives() {
    ctx.font = "20px Monaco";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 120, 30);
}

// Collision detection functions
function wallDetection() {
    if (x + dx < 0 + ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
    if (y + dy < 0 + ballRadius) {
        dy = -dy;
    } else if (y + dy == (canvas.height * 0.85)) {
        if (x > paddlePosition - ballRadius && x < paddlePosition + paddleWidth + ballRadius) {
            dy = -dy;
        }
    }
    if (y + dy > canvas.height - ballRadius) {
        gameOver();
    }
}

function collisionDetection() {
    for (var i = 0; i < brickColumnCount; i++) {
        for (var j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status == 1) {
                if (x > bricks[i][j].x && x < bricks[i][j].x + brickWidth && y > bricks[i][j].y && y < bricks[i][j].y + brickHeight) {
                    dy = -dy;
                    bricks[i][j].status = false;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        $('#winnerModal').modal('show');
                        document.querySelector("#winMessage").innerHTML = `You have beaten JS Breakout! You have gotten a perfect score of 50/50! You have used ${3 - lives + 1} lives.`;
                        pauseGame();
                    }
                }
            }
        }
    }
}

// Key Handlers
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightArrowPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftArrowPressed = true;
    } else if (e.key == "`") {
        document.querySelector('#settingsCollapseButton').click();
    } else if (e.key == "p" || e.key == "P") {
        if (isPaused) {
            unpauseGame();
        } else {
            pauseGame();
        }
    } else if (e.key == "o" || e.key == "O") {
        restartGame();
    } else if (e.key == "1") {
        changeSpeed(1);
    } else if (e.key == "2") {
        changeSpeed(2);
    } else if (e.key == "3") {
        changeSpeed(3);
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightArrowPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftArrowPressed = false;
    }
}

function mouseMoveHandler(e) {
    var mousePosition = e.clientX - canvas.offsetLeft;
    if (mousePosition > 0 + (paddleWidth / 3) && mousePosition < canvas.width - (paddleWidth / 3)) {
        paddlePosition = mousePosition - (paddleWidth / 2);
    }
}

// Game control functions
function movement() {
    x += dx;
    y += dy;
    if (leftArrowPressed) {
        paddlePosition -= 7.5;
        if (paddlePosition < 0) {
            paddlePosition = 0;
        }
    } else if (rightArrowPressed) {
        paddlePosition += 7.5;
        if (paddlePosition > canvas.width - paddleWidth) {
            paddlePosition = canvas.width - paddleWidth
        }
    }
}

// Game state functions
function changeSpeed(option) {
    if (option == 1) {
        speed = 12.5;
        document.querySelector("#speedSettings").innerHTML = `<button type="button" class="btn btn-success" onclick="changeSpeed(1)">Easy</button>
        <button type="button" class="btn btn-outline-warning" onclick="changeSpeed(2)">Medium</button>
        <button type="button" class="btn btn-outline-danger" onclick="changeSpeed(3)">Hard</button>`;
        clearInterval(interval);
        interval = setInterval(draw, speed);
    } else if (option == 2) {
        speed = 7.5;
        document.querySelector("#speedSettings").innerHTML = `<button type="button" class="btn btn-outline-success" onclick="changeSpeed(1)">Easy</button>
        <button type="button" class="btn btn-warning" onclick="changeSpeed(2)">Medium</button>
        <button type="button" class="btn btn-outline-danger" onclick="changeSpeed(3)">Hard</button>`;
        clearInterval(interval);
        interval = setInterval(draw, speed);
    } else if (option == 3) {
        speed = 2.5;
        document.querySelector("#speedSettings").innerHTML = `<button type="button" class="btn btn-outline-success" onclick="changeSpeed(1)">Easy</button>
        <button type="button" class="btn btn-outline-warning" onclick="changeSpeed(2)">Medium</button>
        <button type="button" class="btn btn-danger" onclick="changeSpeed(3)">Hard</button>`;
        clearInterval(interval);
        interval = setInterval(draw, speed);
    }
}

function livesSelector (newLives) {
    if (lives == originalLives) {
        originalLives = newLives;
        lives = newLives;
        for (var i = 1; i <= 20; i++) {
            if (i == newLives) {
                document.getElementById(`liveSelector${i}`).className = "btn btn-dark"
            } else {
                document.getElementById(`liveSelector${i}`).className = "btn btn-outline-dark"
            }
        }
    } else {
        pauseGame();
        $('#livesErrorModal').modal('show');
    }
}

function gameOver() {
    lives--;
    if (!lives) {
        $('#gameoverModal').modal('show');
        document.querySelector("#gameoverMessage").innerHTML = `Unfortunately, you were not able to beat JS-Breakout... Your final score is ${score}.`;
        pauseGame();
    } else {
        x = canvas.width / 2;
        y = canvas.height * 0.85;
        dx = 2;
        dy = -2;
        paddlePosition = (canvas.width - paddleWidth) / 2;
    }
}

// Game flow control functions
function pauseGame () {
    isPaused = true;
    clearInterval(interval);
    document.querySelector("#gameplayControl").innerHTML = `
        <button type="button" class="btn btn-info" onclick="unpauseGame()">Unpause</button>
        <br>
    `;
}

function unpauseGame () {
    isPaused = false;
    interval = setInterval(draw, speed);
    document.querySelector("#gameplayControl").innerHTML = `
        <button type="button" class="btn btn-outline-info" onclick="pauseGame()">Pause</button>
        <br>
    `;
}

function restartGame () {
    $('#restartModal').modal('show');
    document.getElementById("restartMessage").innerHTML = `Are you sure you want to restart the game? Your current score is ${score} and you still have ${lives} lives remaining.`;
    pauseGame();
}

function confirmRestartGame () {
    document.location.reload();
}

function checkFocus () {
    if (!document.hasFocus()) {
        pauseGame();
    }
}

// Main functions
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    printScore();
    printLives();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    wallDetection();
    movement();
    checkFocus();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

var interval = setInterval(draw, speed);
