import { OneClickEngine, GameObject, createSpriteFromAscii } from '../dist/src/index.js';

// Game constants
const DINO_X_POSITION = 80;
const DINO_GROUND_Y = 50;
const GROUND_Y = 20;
const JUMP_VELOCITY = 400;
const GRAVITY = -800;
const OBSTACLE_SPEED = -200;
const OBSTACLE_SPAWN_X = 640;
const OBSTACLE_SPAWN_INTERVAL = 2;

// Sprite creation functions
function createSprites() {
  return {
    dinoRun: createSpriteFromAscii(`
    ####
   ######
   ##  ##
   ######
   ## ##
  ##   ##
  ##   ##
  #     #
`),
    dinoJump: createSpriteFromAscii(`
    ####
   ######
   ##  ##
   ######
   ## ##
  ##   ##
 ##     ##
##       ##
`),
    cactus: createSpriteFromAscii(`
  ##
  ##
  ##
  ##
  ##
####
####
####
`),
    rock: createSpriteFromAscii(`
 ####
######
######
 ####
`),
    ground: createSpriteFromAscii(`
################################
################################
`)
  };
}

// Dino player class
class Dino extends GameObject {
  constructor(x, y, sprites) {
    super(x, y);
    this.addState('run', sprites.dinoRun);
    this.addState('jump', sprites.dinoJump);
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.groundY = y;
  }
  
  update(dt, buttonState, collisions) {
    // Jump logic
    if (buttonState.pressed && !this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = JUMP_VELOCITY;
      this.setState('jump');
    }
    
    // Apply gravity and update position
    if (this.isJumping) {
      this.jumpVelocity += GRAVITY * dt;
      this.y += this.jumpVelocity * dt;
      
      // Land on ground
      if (this.y <= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.setState('run');
      }
    }
    
    super.update(dt, buttonState);
  }
}

// Obstacle class
class Obstacle extends GameObject {
  constructor(x, y, sprite) {
    super(x, y);
    this.addState('default', sprite);
  }
  
  update(dt, buttonState, collisions) {
    this.x += OBSTACLE_SPEED * dt;
    
    // Remove obstacle when it goes off screen
    if (this.x < -50) {
      this.active = false;
    }
    
    super.update(dt, buttonState);
  }
}

// Ground class
class Ground extends GameObject {
  constructor(x, y, sprites) {
    super(x, y);
    this.addState('default', sprites.ground);
  }
  
  // Ground doesn't move - no update method needed
}

// Initialize engine
const engine = new OneClickEngine();
const canvas = document.getElementById('gameCanvas');
engine.init(canvas, 640, 240);

// Create sprites
const sprites = createSprites();

// Game initialization
const dino = new Dino(DINO_X_POSITION, DINO_GROUND_Y, sprites);
engine.addObject(dino);

// Create static ground
const ground = new Ground(0, GROUND_Y, sprites);
engine.addObject(ground);

// Obstacle spawning
let obstacleTimer = 0;
const spawnObstacle = () => {
  const obstacles = [sprites.cactus, sprites.rock];
  const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
  const obstacle = new Obstacle(OBSTACLE_SPAWN_X, DINO_GROUND_Y, randomObstacle);
  engine.addObject(obstacle);
};

// Game loop with obstacle spawning
const originalUpdate = engine.update;
engine.update = function(dt) {
  originalUpdate.call(this, dt);
  
  obstacleTimer += dt;
  if (obstacleTimer > OBSTACLE_SPAWN_INTERVAL) {
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
