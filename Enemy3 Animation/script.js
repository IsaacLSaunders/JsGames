/** @type {HTMLCanvasElement} */

//VERTICAL AND HORIZONTAL MOVEMENT WITH SINE X COSINE WAVE PATTERNS FOR X & Y AXIS

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numberOfEnemies = 10;
const arrayOfEnemies = [];

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = './assets/enemy3.png';
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    if (this.spriteWidth <= this.spriteHeight) {
      this.width = (Math.random() * this.spriteWidth + 100) / 3;
      this.height = (this.spriteHeight / this.spriteWidth) * this.width;
    } else {
      this.height = (Math.random() * this.spriteHeight + 100) / 3;
      this.width = (this.spriteWidth / this.spriteHeight) * this.height;
    }
    console.log(this.height, this.width);
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 5 + 1);
    //determines starting position along the path
    this.angle = Math.random() * 10000;
    //determines the speed at which the sprites move along their path
    this.angleSpeed = Math.random() * 2 + 0.5;

    //determines radius of the circle the sprites move in
    // this.curve = Math.random() * 200 + 50;
  }

  update() {
    //Math.sin wave in conjunction with Math.cos (Sine and Cosine) create a circular patern
    //flipping Math.sin and Math.cos on either x or y axis will change the direction of the circular pattern
    //changing the angle at which this.angle * pi is divided by will change the speed of of the wave again if the angle is kept the same
    //changing the angle so x and y are different will result in non circular patterns.
    this.x =
      //change the first instance of canvas.width back to this.curve to create a more random pattern instead of a fixed path on both x&y axis
      (canvas.width / 2) * Math.sin((this.angle * Math.PI) / 200) +
      (canvas.width / 2 - this.width / 2);
    this.y =
      (canvas.height / 2) * Math.cos((this.angle * Math.PI) / 250) +
      (canvas.height / 2 - this.height / 2);

    this.angle += this.angleSpeed;

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
