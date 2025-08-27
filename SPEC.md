# One Click Games Engine Specification

## Overview
A minimalist JavaScript game engine for single-button games with black/white pixel graphics and pixel-perfect collision detection.

## Core Architecture

### Display System
- **Canvas**: Fixed-size pixel grid (e.g., 320x240, 640x480)
- **Graphics**: Only black (1) and white (0) pixels
- **Coordinate System**: Origin (0,0) at bottom-left corner
- **Rendering**: 60fps frame-based rendering

### Input System
- **Single Button**: Space bar, mouse click, or touch
- **Button States**:
  - `PRESSED` - Fired once when button transitions from up to down
  - `DOWN` - Continuous state while button is held
  - `RELEASED` - Fired once when button transitions from down to up  
  - `UP` - Continuous state while button is not held

## Game Objects

### GameObject Structure
```javascript
{
  x, y,                    // position (bottom-left corner)
  vx, vy,                  // velocity (pixels/second)
  ax, ay,                  // acceleration (pixels/second²)
  currentState,            // current sprite state name
  states: {},              // state name -> sprite mapping
  active,                  // whether object is updated/rendered
  layer                    // rendering order (higher = front)
}
```

### Sprite Structure
```javascript
{
  width, height,           // dimensions in pixels
  pixels                   // 2D array: pixels[y][x] = 0 (white) or 1 (black)
}
```

## Collision Detection
- **Method**: Pixel-perfect collision only
- **Check**: Two objects collide when any black pixel from one sprite overlaps any black pixel from another sprite
- **Optimization**: Bounding box check first, then pixel-by-pixel

## Game Engine Core

### Engine Structure
```javascript
{
  canvas, ctx,             // HTML5 canvas and context
  width, height,           // game dimensions
  objects: [],             // array of game objects
  score, lives,            // game state variables
  gameState,               // 'playing', 'paused', 'gameOver'
  buttonState: {           // current input state
    pressed, down, released, up
  }
}
```

### Core Methods
- `addObject(obj)` - Add object to game
- `removeObject(obj)` - Remove object from game  
- `drawSprite(sprite, x, y)` - Draw sprite at world coordinates
- `update(dt)` - Update all objects and check collisions
- `render()` - Draw everything to canvas
- `start()` - Begin game loop
- `stop()` - End game loop

### Physics Integration
- Objects automatically update position based on velocity and acceleration
- Physics formula: `position += velocity * dt + 0.5 * acceleration * dt²`
- Final positions rounded to pixel boundaries

## Game Implementation Pattern

### Basic Game Structure
```javascript
// 1. Create engine
const engine = new OneClickEngine('canvas', 320, 240);

// 2. Create sprites
const playerSprite = createSpriteFromAscii(`
  ##
 ####
##  ##
`);

// 3. Create game objects
class Player extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.addState('default', playerSprite);
    this.ay = -500; // gravity
  }
  
  update(dt, buttonState) {
    if (buttonState.pressed) {
      this.vy = 200; // jump
    }
    super.update(dt, buttonState);
  }
}

// 4. Initialize game
const player = new Player(50, 100);
engine.addObject(player);

// 5. Handle collisions
engine.handleCollision = (obj1, obj2) => {
  // Game-specific collision logic
};

// 6. Start game
engine.start();
```

### Sprite Creation Helper
```javascript
// Create sprite from ASCII art (# = black, space = white)
createSpriteFromAscii(asciiString)
```

## Example Game Types

### Flappy Bird Style
- Player has gravity (negative Y acceleration)
- Button press sets upward velocity
- Pipes move left automatically
- Collision with pipes = game over

### Chrome Dino Style  
- Player runs automatically (animated sprite states)
- Button press while on ground = jump (set Y velocity)
- Obstacles move left automatically
- Collision with obstacles = game over

### Helicopter Game Style
- Button held = upward acceleration
- Button released = downward acceleration (gravity)
- Walls/obstacles move left automatically
- Collision with walls = game over

## Performance Notes
- All positions stored as floats but rendered at integer pixel positions
- Collision detection optimized with bounding box pre-check
- Objects rendered in layer order (back to front)
- Inactive objects automatically removed from update/render loops
