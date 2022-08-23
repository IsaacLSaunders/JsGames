import Paddle from './paddle.js';
import InputHandler from './input.js';
import Ball from './ball.js';
import { buildLevel, levels } from './levels.js';

const GAME_STATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameState = GAME_STATE.MENU;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.bricks = [];
    this.lives = 3;
    this.levels = [...levels];
    this.currentLevelIndex = 0;
    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gameState !== GAME_STATE.MENU &&
      this.gameState !== GAME_STATE.NEWLEVEL
    )
      return;

    this.bricks = buildLevel(this, this.levels[this.currentLevelIndex]);
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];

    this.gameState = GAME_STATE.RUNNING;
  }

  update(deltaTime) {
    if (this.lives === 0) {
      this.gameState = GAME_STATE.GAMEOVER;
    }

    if (
      this.gameState === GAME_STATE.PAUSED ||
      this.gameState === GAME_STATE.MENU ||
      this.gameState === GAME_STATE.GAMEOVER
    )
      return;

    if (this.bricks.length === 0) {
      this.currentLevelIndex++;
      this.gameState = GAME_STATE.NEWLEVEL;
      this.start();
    }

    [...this.gameObjects, ...this.bricks].forEach((object) => {
      object.update(deltaTime);
    });

    this.bricks = this.bricks.filter((bricks) => !bricks.markedForDeletion);
  }

  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach((object) => {
      object.draw(ctx);
    });

    //when the game is paused, color the screen and display text 'paused'
    if (this.gameState === GAME_STATE.PAUSED) {
      //draw a new rect starting at the 0,0 pixel start, with the game frame as the end points
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      //set the color of the rectangle with black at 50% opacity ==> see rgba values
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      //fill the new rectangle
      ctx.fill();

      //set a font style and size for the text
      ctx.font = '30px Arial';
      //set the color of the text
      ctx.fillStyle = 'white';
      //align the text
      ctx.textAlign = 'center';
      //color the text, args are (string, px start point x-axis, px start point y-axis)
      ctx.fillText('Paused', this.gameWidth / 2, this.gameHeight / 2);
    }

    //when the game is on the menu screen, color the screen and display text 'Press Spacebar to Start'
    if (this.gameState === GAME_STATE.MENU) {
      //draw a new rect starting at the 0,0 pixel start, with the game frame as the end points
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      //set the color of the rectangle with black at 50% opacity ==> see rgba values
      ctx.fillStyle = 'rgba(0,0,0,1)';
      //fill the new rectangle
      ctx.fill();

      //set a font style and size for the text
      ctx.font = '30px Arial';
      //set the color of the text
      ctx.fillStyle = 'white';
      //align the text
      ctx.textAlign = 'center';
      //color the text, args are (string, px start point x-axis, px start point y-axis)
      ctx.fillText(
        'Press SPACEBAR to start the game!',
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }

    //when GAME OVER occurs, color the screen and display text 'GAME OVER, to play again, press SPACE BAR'
    if (this.gameState === GAME_STATE.GAMEOVER) {
      //draw a new rect starting at the 0,0 pixel start, with the game frame as the end points
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      //set the color of the rectangle with black at 50% opacity ==> see rgba values
      ctx.fillStyle = 'rgba(0,0,0,1)';
      //fill the new rectangle
      ctx.fill();

      //set a font style and size for the text
      ctx.font = '30px Arial';
      //set the color of the text
      ctx.fillStyle = 'white';
      //align the text
      ctx.textAlign = 'center';
      //color the text, args are (string, px start point x-axis, px start point y-axis)
      ctx.fillText('GAME OVER', this.gameWidth / 2, this.gameHeight / 2 - 100);
      ctx.fillText(
        'To play again, press SPACEBAR',
        this.gameWidth / 2,
        this.gameHeight / 2 + 100
      );
    }
  }

  togglePause() {
    if (
      this.gameState === GAME_STATE.MENU ||
      this.gameState === GAME_STATE.GAMEOVER
    )
      return;
    if (this.gameState == GAME_STATE.PAUSED) {
      this.gameState = GAME_STATE.RUNNING;
    } else {
      this.gameState = GAME_STATE.PAUSED;
    }
  }
}
