/** @type {HTMLCanvasElement} */

//Partial movement (shaking) on the x & y axis

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
    this.image.src = './assets/enemy1.png';
    this.spriteWidth = 293;
    this.spriteHeight = 155;
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
    this.movementSpeed = Math.floor(Math.random() * 5 + 1);
    this.subOrAdd = 0;
  }

  update() {
    //slows down render rate based on movementSpeed prop
    if (gameFrame % this.movementSpeed === 0) {
      this.x += Math.random() * 15 - 7.5;
      this.y += Math.random() * 15 - 7.5;
    }
    //slows down render rate of sprite frame based on flapSpeed prop
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
