const W = 87;
const S = 83;
const UP = 38;
const DOWN = 40;

var keysPressed = { w: false, s: false, up: false, down: false };

var gameLoopId, tickSpeedId;
var canvasElement;
var canvasContext;
var gameIsRunning = false;
var tickSpeed = 20;

var player1Score = 0, player2Score = 0;

var colors = ["yellow", "red", "green", "brown", "black", "#c3c96f", "#6fdec4", "#ed8540"];

var player1, player2;

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

class Ball {
    constructor(x, y, radius, xSpeed, ySpeed, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.color = color;
    }
}


window.onload = init;


function init() {
    canvasElement = document.getElementById("gamecanvas");
    canvasContext = canvasElement.getContext("2d");
    canvasContext.fillStyle = "yellow";

    player1 = new Player(20, 220, 20, 90, "#414a85");
    player2 = new Player(860, 220, 20, 90, "red");

    var ballx = getRandomInt(2) == 0 ? -5 : 5;
    var bally = getRandomInt(20) + 1 - 10;
    while (bally == 0) {
        bally = getRandomInt(20) + 1 - 10;
    }

    ball = new Ball(canvasElement.width / 2, canvasElement.height / 2, 10, ballx, bally, "green");

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    startGame();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function startGame() {
    gameIsRunning = true;
    tickSpeed = 20;
    gameLoopId = setInterval(gametick, tickSpeed);
    tickSpeedId = setInterval(function(){
        tickSpeed--;
        clearInterval(gameLoopId);
        gameLoopId = setInterval(gametick, tickSpeed);
    }, 4000);
}

function gametick() {
    if (gameIsRunning) {
        update();
        render();
    } else {
        // we lost
        clearInterval(gameLoopId);
        clearInterval(tickSpeedId);
        canvasContext.font = "50px Arial";
        canvasContext.fillText("Game Over", canvasElement.width / 2 - 150, canvasElement.height / 2 + 20);
        setTimeout(init, 2000)
    }
}

function update() {
    updatePlayers();
    updateBall();
}

function render() {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.beginPath();
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.closePath();

    canvasContext.fillStyle = player1.color;
    canvasContext.fillRect(player1.x, player1.y, player1.width, player1.height);

    canvasContext.fillStyle = player2.color;
    canvasContext.fillRect(player2.x, player2.y, player2.width, player2.height);

    canvasContext.fillStyle = ball.color;
    canvasContext.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, true);
    canvasContext.fill();

    canvasContext.beginPath();
    canvasContext.moveTo(canvasElement.width / 2, 0);
    canvasContext.lineTo(canvasElement.width / 2, canvasElement.height);
    canvasContext.stroke();

    canvasContext.fillStyle = "white";
    canvasContext.font = "50px Arial";
    canvasContext.fillText(player1Score, canvasElement.width / 2 - 150, 50);
    canvasContext.fillText(player2Score, canvasElement.width / 2 + 150, 50);
}

function updatePlayers() {
    if (keysPressed['w'] == true && (player1.y - 10) >= 0) { // player1
        player1.y = player1.y - 10;
    }

    if (keysPressed['s'] == true && (player1.y + 10 + 90) <= canvasElement.height) { // player1
        player1.y = player1.y + 10;
    }

    if (keysPressed['up'] == true && (player2.y - 10) >= 0) { // player2
        player2.y -= 10;
    }

    if (keysPressed['down'] == true && (player2.y + 10 + 90) <= canvasElement.height) { // player2
        player2.y += 10;
    }
}

function updateBall() {
    checkPlayerCollision();
    checkWallCollision();
    checkForLose();
}

function checkPlayerCollision() {
    if ((ball.x + ball.xSpeed - ball.radius) == player1.x + 15 && (ball.y <= player1.y + 90) && (ball.y >= player1.y)) {
        ball.xSpeed = -ball.xSpeed;
        player1.color = colors[getRandomInt(colors.length)]
        ball.color = colors[getRandomInt(colors.length)]
    } else if ((ball.x + ball.xSpeed + ball.radius) == (player2.x + 5) && (ball.y <= player2.y + 90) && (ball.y >= player2.y)) {
        ball.xSpeed = -ball.xSpeed;
        player2.color = colors[getRandomInt(colors.length)]
        ball.color = colors[getRandomInt(colors.length)]
    } else {
        // just moving the ball
        ball.x += ball.xSpeed;
    }
}

function changeBallSpeed() {
    if(ball.ySpeed >= 0 ) {
        ball.ySpeed + (getRandomInt(2) == 0 ? 5 : -5);
        if(ball.ySpeed == 0) {
            ball.ySpeed + (getRandomInt(2) == 0 ? 5 : -5);
        }
    }
}

// function ballHitsPlayer1() {
//     return (ball.x + ball.xSpeed - ball.radius) == player1.x + 15 && (ball.y <= player1.y + 90) && (ball.y >= player1.y);
// }

// function ballHitsPlayer2() {
//     return (ball.x + ball.xSpeed + ball.radius) == (player2.x + 5) && (ball.y <= player2.y + 90) && (ball.y >= player2.y)
// }

function checkWallCollision() {
    if ((ball.y + ball.ySpeed - ball.radius) >= 0
        && (ball.y + ball.ySpeed + ball.radius) <= canvasElement.height) {
        ball.y += ball.ySpeed;
    } else {
        ball.ySpeed = -ball.ySpeed;
    }
}

function checkForLose() {
    if ((ball.x + ball.xSpeed + ball.radius) < 0) {
        // player 1 misses the ball
        gameIsRunning = false;
        player2Score++;
    }

    if ((ball.x + ball.xSpeed - ball.radius) > canvasElement.width) {
        // player 2 misses the ball
        gameIsRunning = false;
        player1Score++;
    }
}

function handleKeyDown(e) {
    if (e.keyCode == W) { // player1
        keysPressed["w"] = true;
    } else if (e.keyCode == S) { // player1
        keysPressed["s"] = true;
    } else if (e.keyCode == UP) { // player2
        keysPressed["up"] = true;
    } else if (e.keyCode == DOWN) { // player2
        keysPressed["down"] = true;
    }
}

function handleKeyUp(e) {
    if (e.keyCode == W) { // player1
        keysPressed["w"] = false;
    } else if (e.keyCode == S) { // player1
        keysPressed["s"] = false;
    } else if (e.keyCode == UP) { // player2
        keysPressed["up"] = false;
    } else if (e.keyCode == DOWN) { // player2
        keysPressed["down"] = false;
    }
}