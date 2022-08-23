import Game from './game.js';

let canvas = document.getElementById('gameScreen');

//ctx = context
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

/* //CANVAS PROPERTY fillStyle = "insert color as string or RGB value"; sets the color for all future canvas drawings
ctx.fillStyle = 'red';

//CANVAS FUNCTION fillRect(pixelStartXAxis, pixelStartYAxis, height, width)
ctx.fillRect(20, 20, 100, 100);
ctx.fillRect(220, 200, 50, 50);

//if you want to change the color of the drawings you must reset fillStyle
ctx.fillStyle = 'blue';
ctx.fillRect(150, 150, 20, 20); */

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

const gameLoop = (timestamp) => {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
