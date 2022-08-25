const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 700;

const explosions = [];

let gameFrame = 0;

//getBoundingClientRect is used to create an offset when applying x&y coordinates to the click event listener
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    //whenever possible multiply by a decimal instead of dividing, division is more cpu intensive than multiplication
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = './assets/boom.png';
    this.frame = 0;
    this.frameRate = 6;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = './assets/Ice attack 2.wav';
  }

  update() {
    if (this.frame === 0) {
      this.sound.play();
    }
    if (gameFrame % this.frameRate === 0) {
      this.frame > 4 ? explosions.shift() : this.frame++;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width * 0.5,
      0 - this.height * 0.5,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

window.addEventListener('click', (e) => {
  createAnimation(e);
});

// window.addEventListener('mousemove', (e) => {
//   createAnimation(e);
// });

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;

  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  explosions.forEach((explosion) => {
    explosion.update();
    explosion.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
