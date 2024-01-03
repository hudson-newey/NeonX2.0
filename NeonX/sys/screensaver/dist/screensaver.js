var Ball = /** @class */ (function () {
    function Ball() {
        this.ballSpeed = 2;
        this.radius = 50;
        this.x = getRandomInt(50, window.innerWidth - this.diameter);
        this.y = getRandomInt(50, window.innerHeight - this.diameter);
        this.velocityX = getRandomInt(-1, 1);
        this.velocityY = getRandomInt(-1, 1);
        while (this.velocityX === 0) {
            this.velocityX = getRandomInt(-1, 1);
        }
        while (this.velocityY === 0) {
            this.velocityY = getRandomInt(-1, 1);
        }
        var red = getRandomInt(70, 255);
        var green = getRandomInt(70, 255);
        var blue = getRandomInt(70, 255);
        this.ballColor = "rgb(" + red + ", " + green + ", " + blue + ")";
        this.ballId = "ball-" + getRandomInt(0, 1000000);
        var svgContainerElement = document.getElementById("svgContainer");
        if (!svgContainerElement)
            throw new Error("svgContainerElement is null");
        var svgCircleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        svgCircleElement.setAttribute("id", "" + this.ballId);
        svgCircleElement.setAttribute("r", "" + this.radius);
        svgContainerElement.appendChild(svgCircleElement);
    }
    Object.defineProperty(Ball.prototype, "diameter", {
        get: function () {
            return this.radius * 2;
        },
        enumerable: false,
        configurable: true
    });
    Ball.prototype.moveBall = function (x, y) {
        this.x = this.x + (x * this.velocityX);
        this.y = this.y + (y * this.velocityY);
        if (this.x <= this.radius) {
            this.velocityX = -this.velocityX;
        }
        if (this.y <= this.radius) {
            this.velocityY = -this.velocityY;
        }
        if (this.x >= window.innerWidth - this.radius) {
            this.velocityX = -this.velocityX;
        }
        if (this.y >= window.innerHeight - this.radius) {
            this.velocityY = -this.velocityY;
        }
        var ballElement = document.getElementById("" + this.ballId);
        if (ballElement === null) {
            return this;
        }
        ballElement.setAttribute("cx", "" + this.x);
        ballElement.setAttribute("cy", "" + this.y);
        ballElement.setAttribute("fill", "" + this.ballColor);
        return this;
    };
    Ball.prototype.tick = function () {
        this.moveBall(this.ballSpeed, this.ballSpeed);
    };
    return Ball;
}());
function getRandomInt(upper, lower) {
    upper = Math.ceil(upper);
    lower = Math.floor(lower);
    return Math.floor(Math.random() * (lower - upper + 1)) + upper;
}
function terminateScreensaver() {
    var urlParams = new URLSearchParams(window.location.search);
    var username = urlParams.get("usr");
    if (username === null) {
        window.location.href = "../../../login.html";
    }
    window.location.href = "../../../desktop.html?usr=" + username;
}
function moveBall(x, y) {
    var ballElement = document.getElementById("svgCircle");
    if (ballElement === null) {
        return;
    }
    ballElement.setAttribute("cx", "" + x);
    ballElement.setAttribute("cy", "" + y);
}
var numberOfBalls = 7;
var balls = [];
for (var i = 0; i < numberOfBalls; i++) {
    balls.push(new Ball());
}
function screensaverAnimation() {
    balls.forEach(function (ball) {
        ball.tick();
    });
    setTimeout(screensaverAnimation, 0);
}
screensaverAnimation();
