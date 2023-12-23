class Ball {
  public constructor() {
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

    const red = getRandomInt(70, 255);
    const green = getRandomInt(70, 255);
    const blue = getRandomInt(70, 255);

    this.ballColor = `rgb(${red}, ${green}, ${blue})`;

    this.ballId = `ball-${getRandomInt(0, 1000000)}`;

    const svgContainerElement = document.getElementById("svgContainer") as SVGElement | null;

    if (!svgContainerElement) throw new Error("svgContainerElement is null");

    const svgCircleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    svgCircleElement.setAttribute("id", `${this.ballId}`);
    svgCircleElement.setAttribute("r", `${this.radius}`);
    svgContainerElement.appendChild(svgCircleElement);
  }
  
  public x: number;
  public y: number;
  public radius: number;
  public velocityX: number;
  public velocityY: number;
  private ballColor: string;
  private ballSpeed: number = 2;
  private ballId: string;

  public get diameter(): number {
    return this.radius * 2;
  }

  public moveBall(x: number, y: number): Ball {
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

    const ballElement = document.getElementById(`${this.ballId}`) as SVGElement | null;

    if (ballElement === null) {
      return this;
    }

    ballElement.setAttribute("cx", `${this.x}`);
    ballElement.setAttribute("cy", `${this.y}`);
    ballElement.setAttribute("fill", `${this.ballColor}`);

    return this;
  }

  public tick(): void {
    this.moveBall(this.ballSpeed, this.ballSpeed);
  }
}

function getRandomInt(upper, lower) {
  upper = Math.ceil(upper);
  lower = Math.floor(lower);
  return Math.floor(Math.random() * (lower - upper + 1)) + upper;
}

function terminateScreensaver(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("usr");

  if (username === null) {
    window.location.href = "../../../login.html";
  }

  window.location.href = `../../../desktop.html?usr=${username}`;
}

function moveBall(x: number, y: number): void {
  const ballElement = document.getElementById("svgCircle") as SVGElement | null;

  if (ballElement === null) {
    return;
  }

  ballElement.setAttribute("cx", `${x}`);
  ballElement.setAttribute("cy", `${y}`);
}

const numberOfBalls = 7;
const balls: Ball[] = [];

for (let i = 0; i < numberOfBalls; i++) {
  balls.push(new Ball());
}

function screensaverAnimation(): void {
  balls.forEach((ball) => {
    ball.tick();
  });
  
  setTimeout(screensaverAnimation, 0);
}

screensaverAnimation();
