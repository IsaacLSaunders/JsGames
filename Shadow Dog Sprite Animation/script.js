const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

//playerState is used in switching between animations when the selected dropdown is changed
//set the variable and hard code to the default option
//create a const variable to hold our html select element
//add an event listener to the html element with change as its type
//set playerState to the extracted event target value property set in the html option
let playerState = 'idle';
const selectedAnimation = document.getElementById('animations');
selectedAnimation.addEventListener('change', (e) => {
  playerState = e.target.value;
});

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

//Image() constructor is used to create a new HTMLImageElement instance, Image can take two parameters, width and height
//playerImage.src is the same as adding an src identifier to an html img tag ==> <img src="./assets/shadow_dog.png">
const playerImage = new Image();
playerImage.src = './assets/shadow_dog.png';

//spriteWidth and spriteHeight were calculated based on the width and length of the sprite page, divided by the number of rows and columns
const spriteWidth = 575;
const spriteHeight = 523;

//gameFrame & staggerFrames refer to the current frame being rendered and the number of frames needed to render before a new sprite is animated
//this will increase or decrease the percieved frame rate
let gameFrame = 0;
const staggerFrames = 5;

//SPRITEANIMATIONS is an array of key:value pairs that holds the name property from animationStates as the key,
//and an array of objects holding x & y coordinates for each sprite as the value
const spriteAnimations = [];

//ANIMATIONSTATES is an array of objects holding a name property and a frames property that holds the value equal to the number of frames in each row,
//the row is represented by the index number of the object in the array, ex. name:idle is at position 0 in the array, hence idle is the sprite in the first row
const animationStates = [
  {
    name: 'idle',
    frames: 7,
  },
  {
    name: 'jump',
    frames: 7,
  },
  {
    name: 'fall',
    frames: 7,
  },
  {
    name: 'run',
    frames: 9,
  },
  {
    name: 'dizzy',
    frames: 11,
  },
  {
    name: 'sit',
    frames: 5,
  },
  {
    name: 'roll',
    frames: 7,
  },
  {
    name: 'bite',
    frames: 7,
  },
  {
    name: 'KO',
    frames: 12,
  },
  {
    name: 'getHit',
    frames: 4,
  },
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimations[state.name] = frames;
});

console.log(animationStates);
console.log(spriteAnimations);

//ctx.drawImage ==> can take 3, 5, or 9 arguments ==> 9 args has most control
//input image is cropped at sourceX and sourceY with the size being sourceWidth by sourceHeight
//cropped image is then placed on canvas at destinationX&Y with size of destinationWidth&Height
//(image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight)

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //the variable POSITION gives us the current frame being rendered
  //Math.floor gives us only whole integers ==> gameFrame divided by the staggerFrame rate
  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[playerState].loc.length;
  let frameX = spriteWidth * position;
  let frameY = spriteAnimations[playerState].loc[position].y;
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
