import { OneClickEngine, GameObject, createSpriteFromAscii } from '../dist/src/index.js';

function createSprites() {
  return {
    stand: createSpriteFromAscii(`
  ##
 ####
##  ##
`),
    jump: createSpriteFromAscii(`
  ##
 ####
####
`)
  };
}

class Player extends GameObject {
  constructor(x, y, sprites) {
    super(x, y);
    this.addState('stand', sprites.stand);
    this.addState('jump', sprites.jump);
  }
  
  update(buttonState, collisions) {
    if (this.x > 0) {
      this.x -= 1;
    }
    if (buttonState.pressed) {
      this.x += 100
    }
    super.update(buttonState);
  }
}

const engine = new OneClickEngine();
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
canvas.style.border = '2px solid black';
canvas.style.display = 'block';
canvas.style.margin = '20px auto';
document.body.appendChild(canvas);

engine.init(canvas, 400, 300);

const sprites = createSprites();
const player = new Player(50, 100, sprites);
engine.addObject(player);

engine.start();
