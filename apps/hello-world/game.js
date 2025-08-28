import { OneClickEngine, GameObject, createSpriteFromAscii } from '../dist/src/index.js';

const standSprite = createSpriteFromAscii(`
  ##
 ####
##  ##
`);

const jumpSprite = createSpriteFromAscii(`
  ##
 ####
####
`);

class Player extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.addState('stand', standSprite);
    this.addState('jump', jumpSprite);
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

const player = new Player(50, 100);
engine.addObject(player);

engine.start();
