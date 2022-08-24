/** @type {HTMLCanvasElement} */

//VERTICAL AND HORIZONTAL MOVEMENT WITH SINE X COSINE WAVE PATTERNS FOR X & Y AXIS

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numberOfEnemies = 5;
const arrayOfEnemies = [];

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = './assets/enemy4.png';
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    if (this.spriteWidth <= this.spriteHeight) {
      this.width = (Math.random() * this.spriteWidth + 100) / 3;
      this.height = (this.spriteHeight / this.spriteWidth) * this.width;
    } else {
      this.height = (Math.random() * this.spriteHeight + 100) / 3;
      this.width = (this.spriteWidth / this.spriteHeight) * this.height;
    }
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.newX = Math.random() * (canvas.width - this.width);
    this.newY = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 5 + 1);
    this.interval = Math.floor(Math.random() * 200 + 50);
  }

  update() {
    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (canvas.width - this.width);
      this.newY = Math.random() * (canvas.height - this.height);
    }

    let dx = this.x - this.newX;
    let dy = this.y - this.newY;

    this.x -= dx / 50;
    this.y -= dy / 50;
    // this.x = 0;
    // this.y = 0;
    //sets an endless loop, when sprite reaches left side of canvas, return the sprite to the right side of the canvas
    if (this.x + this.width < 0) this.x = canvas.width;

    //slows down render rate of sprite frame based on flapSpeed property
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

for (let i = 0; i < numberOfEnemies; i++) {
  arrayOfEnemies.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  arrayOfEnemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
