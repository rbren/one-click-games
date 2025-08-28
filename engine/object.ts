import { Sprite } from './sprite';

export interface Renderer {
  drawSprite(sprite: Sprite, x: number, y: number): void;
}

export interface ButtonState {
  [key: string]: boolean;
}

export type Collision = unknown;

export abstract class GameObject {
  x: number;
  y: number;
  currentState?: string;
  states: Map<string, Sprite> = new Map();
  active = true;
  layer: number;

  constructor(x = 0, y = 0, layer = 0) {
    this.x = x;
    this.y = y;
    this.layer = layer;
  }

  addState(name: string, sprite: Sprite): void {
    this.states.set(name, sprite);
    if (!this.currentState) this.currentState = name;
  }

  setState(name: string): void {
    if (!this.states.has(name)) throw new Error(`State not found: ${name}`);
    this.currentState = name;
  }

  getCurrentSprite(): Sprite | undefined {
    return this.currentState ? this.states.get(this.currentState) : undefined;
  }

  abstract update(buttonState: ButtonState, collisions: Collision[]): void;

  render(renderer: Renderer): void {
    if (!this.active) return;
    const sprite = this.getCurrentSprite();
    if (sprite) renderer.drawSprite(sprite, this.x, this.y);
  }
}
