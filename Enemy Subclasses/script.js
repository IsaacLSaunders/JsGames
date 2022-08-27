//WHEN WORKING LOCALLY USE DOMContentLoaded,
//WHEN SERVING ASSETS FROM A SERVER ONCE HOSTED, USE 'loaded' EVENT LISTENER TYPE

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');

  CANVAS_WIDTH = canvas.width = 500;
  CANVAS_HEIGHT = canvas.height = 800;

  let lastTime = 1;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      this.enemyTypes = ['worm', 'ghost', 'spider'];
    }

    update(deltaTime) {
      //deletes enemy instances from the enemies array once they are past the left edge of the canvas
      //this functionality could be added inside the if statement that adds enemies to the array so as to reduce the amount of times
      //the Array.filter method is called to increase performance, currently the method is called with every animation frame
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((object) => object.update(deltaTime));
    }

    draw() {
      this.enemies.forEach((object) => object.draw(this.ctx));
    }

    #addNewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randomEnemy === 'worm') {
        this.enemies.push(new Worm(this));
      } else if (randomEnemy === 'ghost') {
        this.enemies.push(new Ghost(this));
      } else if (randomEnemy === 'spider') {
        this.enemies.push(new Spider(this));
      }
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }

    update(deltaTime) {
      this.x -= this.velocityX * deltaTime;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.y < 0 - this.height) this.markedForDeletion = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }

    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.spriteWidth * this.frameX,
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

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      //to randomize size of enemy use these width and height properties
      // this.width = this.spriteWidth * Math.random() * 0.5 + 40;
      // this.height = this.width * (this.spriteHeight / this.spriteWidth);
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.velocityX = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      //to randomize size of enemy use these width and height properties
      // this.width = this.spriteWidth * Math.random() * 0.5 + 40;
      // this.height = this.width * (this.spriteHeight / this.spriteWidth);
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.7;
      this.image = ghost;
      this.velocityX = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 6;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = 0.7;
      super.draw(ctx);
      ctx.restore();
    }

    update(deltaTime) {
      super.update(deltaTime);
      //increasing the multiplier for Math.sin() increased the depth and height of the sine wave the sprite travels on
      this.y += Math.sin(this.angle) * this.curve;
      //increasing this.angle increased the speed at which the sprite moves up and down on the curve
      this.angle += 0.07;
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      //to randomize size of enemy use these width and height properties
      // this.width = this.spriteWidth * Math.random() * 0.5 + 40;
      // this.height = this.width * (this.spriteHeight / this.spriteWidth);
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = Math.random() * this.game.width - this.width;
      this.y = 0 - this.height;
      this.image = spider;
      this.velocityX = 0;
      this.velocityY = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * this.game.height;
    }

    update(deltaTime) {
      if (Math.sign(this.x) === -1) this.x *= -1;
      super.update(deltaTime);
      this.y += this.velocityY * deltaTime;
      if (this.y > this.maxLength) this.velocityY *= -1;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, 0);
      ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.stroke();
      super.draw(ctx);
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);

  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(animate);
  }
  animate(0);
});
