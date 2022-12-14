/** @type {HTMLCanvasElement} */

//ENDLESS HORIZONTAL MOVEMENT WITH SIN WAVE PATTERN

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numberOfEnemies = 20;
const arrayOfEnemies = [];

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = './assets/enemy2.png';
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    if (this.spriteWidth <= this.spriteHeight) {
      this.width = (Math.random() * this.spriteWidth + 100) / 3;
      this.height = (this.spriteHeight / this.spriteWidth) * this.width;
    } else {
      this.height = (Math.random() * this.spriteHeight + 100) / 3;
      this.width = (this.spriteWidth / this.spriteHeight) * this.height;
    }
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 5 + 1);
    //research Math.sin to understand more about what this variable does and how it affects the animation
    this.angle = 0;
    //as angleSpeed increases and decreases, the speed of the wave decreases and increases respectively
    this.angleSpeed = Math.random() * 0.1;
    //as curve increases or decreases, the depth and height of the wave increases or decreases respectively
    this.curve = Math.random() * 5 + 1;
  }

  update() {
    this.x -= this.speed;

    //Math.sin returns a number between -1 and 1
    //the animation imposed on the sprite along the y axis is manipulated my Math.sin
    //Math.sin returns values from an incrementing source that plot out to a wave pattern
    //research Math.sin more to understand what exactly this algo is doing
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;

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
