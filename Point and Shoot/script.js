const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = window.innerWidth;
CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');

COLLISION_CANVAS_WIDTH = collisionCanvas.width = window.innerWidth;
COLLISION_CANVAS_HEIGHT = collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = '50px Impact';
collisionCtx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
let explosions = [];
let particles = [];

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.5 + 0.2;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 3 + 3;
    this.directionY = Math.random() * 3 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = './assets/raven.png';
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 100 + 50;
    //Using random colors for sprite hitbox
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      'rgb(' +
      this.randomColors[0] +
      ',' +
      this.randomColors[1] +
      ',' +
      this.randomColors[2] +
      ')';
    this.hasTrail = Math.random() > 0.5;
  }

  update(deltaTime) {
    if (
      this.y < 0 - this.height * 0.1 ||
      this.y > canvas.height - this.height * 0.9
    ) {
      this.directionY = this.directionY * -1;
    }

    this.x -= this.directionX;
    this.y += this.directionY;

    if (this.x < 0 - this.width) this.markedForDeletion = true;

    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
      if (this.hasTrail)
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color));
        }
    }

    if (this.x < 0 - this.width) gameOver = true;
  }

  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
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

class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = './assets/boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = './assets/boom.wav';
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteHeight,
      this.spriteWidth,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}

class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2 + Math.random() * 50 - 25;
    this.y = y + this.size / 3 + Math.random() * 50 - 25;
    this.color = color;
    this.radius = (Math.random() * this.size) / 10;
    this.maxRadius = Math.random() * 5 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 2 + 0.5;
  }

  update() {
    this.x += this.speedX;
    this.radius += 0.3;
    if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 50, 75);
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 54, 78);
}

function drawGameover() {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillText(
    'GAME OVER, Your Score was ' + score,
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.fillStyle = 'grey';
  ctx.fillText(
    'GAME OVER, Your Score was ' + score,
    canvas.width / 2 + 3,
    canvas.height / 2 + 3
  );
  canvas.style.opacity = '0.75';
}

window.addEventListener('mousedown', (e) => {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pixelColor = detectPixelColor.data;
  ravens.forEach((object) => {
    if (
      object.randomColors[0] === pixelColor[0] &&
      object.randomColors[1] === pixelColor[1] &&
      object.randomColors[2] === pixelColor[2]
    ) {
      object.markedForDeletion = true;
      switch (true) {
        case object.width <= 87:
          score += 4;
          break;
        case object.width > 87 && object.width <= 120:
          score += 3;
          break;
        case object.width > 120 && object.width <= 153:
          score += 2;
          break;
        case object.width > 153:
          score += 1;
          break;
      }
      explosions.push(new Explosion(object.x, object.y, object.width));
      console.log(explosions);
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => {
      return a.width - b.width;
    });
  }

  drawScore();

  [...particles, ...ravens, ...explosions].forEach((object) => {
    object.update(deltaTime);
  });
  [...particles, ...ravens, ...explosions].forEach((object) => {
    object.draw();
  });
  ravens = ravens.filter((object) => !object.markedForDeletion);
  explosions = explosions.filter((object) => !object.markedForDeletion);
  particles = particles.filter((object) => !object.markedForDeletion);

  if (!gameOver) {
    requestAnimationFrame(animate);
  } else {
    drawGameover();
  }
}
animate(0);
