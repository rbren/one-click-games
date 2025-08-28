import { GameObject } from './object.js';
import { CanvasRenderer } from './canvas.js';
import { InputManager } from './input.js';
import { GameLoop } from './update.js';
import { CollisionDetector } from './collision.js';

export class OneClickEngine {
  private gameLoop: GameLoop;
  private renderer: CanvasRenderer;
  private input: InputManager;
  private collisionDetector: CollisionDetector;
  private isInitialized = false;

  constructor() {
    this.renderer = new CanvasRenderer();
    this.input = new InputManager();
    this.collisionDetector = new CollisionDetector();
    this.gameLoop = new GameLoop({
      renderer: this.renderer,
      input: this.input,
      collisionDetector: this.collisionDetector,
    });
  }

  /**
   * Initialize the engine with a canvas element and dimensions
   */
  init(canvasElement: unknown, width: number, height: number): void {
    this.renderer.setupCanvas(canvasElement, width, height);
    this.input.setupEventListeners();
    this.isInitialized = true;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (!this.isInitialized) {
      throw new Error('Engine must be initialized before starting. Call init() first.');
    }
    this.gameLoop.start();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.gameLoop.stop();
  }

  /**
   * Add a game object to the engine
   */
  addObject(obj: GameObject): void {
    this.gameLoop.addObject(obj);
  }

  /**
   * Remove a game object from the engine
   */
  removeObject(obj: GameObject): void {
    this.gameLoop.removeObject(obj);
  }

  /**
   * Get all current game objects
   */
  getObjects(): readonly GameObject[] {
    return this.gameLoop.getObjects();
  }

  /**
   * Get the renderer instance for advanced usage
   */
  getRenderer(): CanvasRenderer {
    return this.renderer;
  }

  /**
   * Get the input manager instance for advanced usage
   */
  getInput(): InputManager {
    return this.input;
  }
}

// Re-export key classes and functions for convenience
export { GameObject } from './object.js';
export { Sprite, createSpriteFromAscii } from './sprite.js';
export { CanvasRenderer } from './canvas.js';
export { InputManager } from './input.js';
export { GameLoop } from './update.js';
export { CollisionDetector } from './collision.js';

// Export types
export type { ButtonState } from './input.js';
export type { Renderer, ButtonState as ObjectButtonState } from './object.js';
export type { CollisionMap } from './update.js';
export type { Collidable } from './collision.js';