/** @type {HTMLCanvasElement} */
/**
 *
 */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

const numberOfEnemies = 120000;
const arrayOfEnemies = [];
let subOrAdd = 0;

class Enemy {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.width = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    this.height = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    this.speed = Math.random() * 8 - 4;
  }

  update() {
    switch (subOrAdd) {
      case 0:
        this.x -= this.speed;
        this.y -= this.speed;
        subOrAdd = 1;
        break;
      case 1:
        this.x += this.speed;
        this.y += this.speed;
        subOrAdd = 2;
        break;
      case 2:
        this.x += this.speed;
        this.y -= this.speed;
        subOrAdd = 3;
        break;
      case 3:
        this.x -= this.speed;
        this.y += this.speed;
        subOrAdd = 0;
        break;
    }
  }

  draw() {
    ctx.strokeRect(this.x, this.y, this.width, this.height);
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
  requestAnimationFrame(animate);
}
animate();
