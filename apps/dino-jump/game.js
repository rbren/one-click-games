// Dino sprites
const dinoRunSprite = createSpriteFromAscii(`
    ####
   ######
   ##  ##
   ######
   ## ##
  ##   ##
  ##   ##
  #     #
`);

const dinoJumpSprite = createSpriteFromAscii(`
    ####
   ######
   ##  ##
   ######
   ## ##
  ##   ##
 ##     ##
##       ##
`);

// Obstacle sprites
const cactusSprite = createSpriteFromAscii(`
  ##
  ##
  ##
  ##
  ##
####
####
####
`);

const rockSprite = createSpriteFromAscii(`
 ####
######
######
 ####
`);

// Ground sprite
const groundSprite = createSpriteFromAscii(`
################################
################################
`);

// Dino player class
class Dino extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.addState('run', dinoRunSprite);
    this.addState('jump', dinoJumpSprite);
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.groundY = y;
    this.gravity = -800;
  }
  
  update(buttonState, collisions) {
    // Jump logic
    if (buttonState === BUTTON_PRESSED && !this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 400;
      this.setState('jump');
    }
    
    // Apply gravity and update position
    if (this.isJumping) {
      this.jumpVelocity += this.gravity * (1/60); // Assuming 60fps
      this.y += this.jumpVelocity * (1/60);
      
      // Land on ground
      if (this.y <= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.setState('run');
      }
    }
    
    super.update(buttonState);
  }
}

// Obstacle class
class Obstacle extends GameObject {
  constructor(x, y, sprite) {
    super(x, y);
    this.addState('default', sprite);
    this.speed = -200; // Move left
  }
  
  update(buttonState, collisions) {
    this.x += this.speed * (1/60); // Move left
    
    // Remove obstacle when it goes off screen
    if (this.x < -50) {
      this.active = false;
    }
    
    super.update(buttonState);
  }
}

// Ground class
class Ground extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.addState('default', groundSprite);
    this.speed = -100;
  }
  
  update(buttonState, collisions) {
    this.x += this.speed * (1/60);
    
    // Reset position for infinite scrolling
    if (this.x < -320) {
      this.x = 0;
    }
    
    super.update(buttonState);
  }
}

// Game initialization
const dino = new Dino(80, 50);
engine.addObject(dino);

// Create ground
const ground1 = new Ground(0, 20);
const ground2 = new Ground(320, 20);
engine.addObject(ground1);
engine.addObject(ground2);

// Obstacle spawning
let obstacleTimer = 0;
const spawnObstacle = () => {
  const obstacles = [cactusSprite, rockSprite];
  const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
  const obstacle = new Obstacle(640, 50, randomObstacle);
  engine.addObject(obstacle);
};

// Game loop with obstacle spawning
const originalUpdate = engine.update;
engine.update = function(dt) {
  originalUpdate.call(this, dt);
  
  obstacleTimer += dt;
  if (obstacleTimer > 2) { // Spawn obstacle every 2 seconds
    spawnObstacle();
    obstacleTimer = 0;
  }
};

// Collision handling
engine.handleCollision = (obj1, obj2) => {
  if ((obj1 instanceof Dino && obj2 instanceof Obstacle) ||
      (obj1 instanceof Obstacle && obj2 instanceof Dino)) {
    // Game over logic would go here
    console.log('Game Over!');
  }
};

engine.start();
