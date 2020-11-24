document.querySelector('#settingsCollapseButton').click();

var canvas = document.getElementById("the_canvas")
var ctx = canvas.getContext("2d");

// Declaring/defining the variables
var score = 0;
var lives = 3;

var speed = 7.5;

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
        speed = 10;
        clearInterval(interval);
        restartGame();
        interval = setInterval(draw, speed);
    } else if (option == 2) {
        speed = 7.5;
        clearInterval(interval);
        restartGame();
        interval = setInterval(draw, speed);
    } else if (option == 3) {
        speed = 5;
        clearInterval(interval);
        restartGame();
        interval = setInterval(draw, speed);
    }
}

function livesSelector () {
    if (lives == parseInt(document.querySelector("#livesSliderHelp").innerHTML)) {
        lives = document.getElementById("livesSlider").value;
        document.querySelector("#livesSliderHelp").innerHTML = lives;
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
    clearInterval(interval);
    document.querySelector("#gameplayControl").innerHTML = `
        <button type="button" class="btn btn-info" onclick="unpauseGame()">Unpause</button>
        <br>
    `;
}

function unpauseGame () {
    interval = setInterval(draw, speed);
    document.querySelector("#gameplayControl").innerHTML = `
        <button type="button" class="btn btn-outline-info" onclick="pauseGame()">Pause</button>
        <br>
    `;
}

function restartGame () {
    document.location.reload();
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
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

var interval = setInterval(draw, speed);
