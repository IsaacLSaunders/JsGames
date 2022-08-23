//grab canvas element with document.getElementById,
//create a context variable by calling getContext with 2D as the argument on the canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

//set canvas width and height ==> must do this or default canvas size will be used
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

let gameSpeed = 10;

//Create variables to store all image assets
const gameBackgroundLayer1 = new Image();
gameBackgroundLayer1.src = './assets/layer-1.png';
const gameBackgroundLayer2 = new Image();
gameBackgroundLayer2.src = './assets/layer-2.png';
const gameBackgroundLayer3 = new Image();
gameBackgroundLayer3.src = './assets/layer-3.png';
const gameBackgroundLayer4 = new Image();
gameBackgroundLayer4.src = './assets/layer-4.png';
const gameBackgroundLayer5 = new Image();
gameBackgroundLayer5.src = './assets/layer-5.png';

//If this game is hosted, because the images are so large you need to make sure that all the assets are properly loaded before starting the game.
//the callback function on the window load event is only called once all dependent resources like stylesheets and images are loaded
//in contrast the DOMContentLoaded event type used on the document event target {{document.addEventListener('DOMContentLoaded', callback)}}
//executed as soon as the DOM for the page has been loaded, without waiting for resources to finish loading.
window.addEventListener('load', () => {
  //Slider and gameSpeed display
  const slider = document.getElementById('slider');
  slider.value = gameSpeed;
  const showGameSpeed = document.getElementById('showGameSpeed');
  showGameSpeed.innerText = gameSpeed;

  slider.addEventListener('change', (e) => {
    gameSpeed = e.target.value;
    showGameSpeed.innerText = gameSpeed;
  });

  //class constructor for each layer with update and draw properties
  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }

    update() {
      this.speed = gameSpeed * this.speedModifier;
      if (this.x <= -this.width) {
        this.x = 0;
      }
      this.x = Math.floor(this.x - this.speed);
    }

    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }

  //create new layers with all of the layer assets and set them with increasing speeds to show parallax
  const layer1 = new Layer(gameBackgroundLayer1, 0.2);
  const layer2 = new Layer(gameBackgroundLayer2, 0.4);
  const layer3 = new Layer(gameBackgroundLayer3, 0.6);
  const layer4 = new Layer(gameBackgroundLayer4, 0.8);
  const layer5 = new Layer(gameBackgroundLayer5, 1);

  //put layer objects into an array to be iterated over when running the animation
  const gameObject = [layer1, layer2, layer3, layer4, layer5];

  //game loop
  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObject.forEach((layer) => {
      layer.update(), layer.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
});
