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
    this.addSteate('jump', jumpSprite);
  }
  
  update(buttonState, collisions) {
    if (this.x > 0) {
      this.x -= 1;
    }
    if (buttonState === BUTTON_PRESSED) {
      this.x += 100
    }
    super.update(buttonState);
  }
}

const player = new Player(50, 100);
engine.addObject(player);

engine.start();
