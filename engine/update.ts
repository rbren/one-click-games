import type { Renderer, ButtonState as ObjButtonState } from './object.js';
import { CollisionDetector } from './collision.js';
import type { GameObject } from './object.js';
import { InputManager } from './input.js';

export type CollisionMap<T extends GameObject = GameObject> = Map<T, T[]>;

type RafFn = (cb: (t: number) => void) => unknown;
type CancelRafFn = (h: unknown) => void;

export interface GameLoopOptions {
  targetFps?: number; // default 60
  autoStart?: boolean; // default false
  raf?: RafFn; // custom requestAnimationFrame
  caf?: CancelRafFn; // custom cancelAnimationFrame
  now?: () => number; // custom time source
}

export class GameLoop {
  private objects: GameObject[] = [];
  private renderer: Renderer | undefined;
  private input: InputManager | undefined;
  private collisionDetector: CollisionDetector;

  private running = false;
  private lastTime = 0;
  private accumulator = 0;
  private timestepMs: number;

  private raf: RafFn;
  private caf: CancelRafFn | undefined;
  private rafHandle: unknown = null;
  private now: () => number;

  constructor(
    params?: {
      objects?: GameObject[];
      renderer?: Renderer;
      input?: InputManager;
      collisionDetector?: CollisionDetector;
    } & GameLoopOptions,
  ) {
    this.objects = params?.objects ? [...params.objects] : [];
    this.renderer = params?.renderer;
    this.input = params?.input;
    this.collisionDetector = params?.collisionDetector ?? new CollisionDetector();

    const fps = params?.targetFps ?? 60;
    this.timestepMs = 1000 / fps;

    this.raf = params?.raf ?? ((cb) => {
      return setTimeout(() => cb(this.now()), this.timestepMs);
    });
    this.caf = params?.caf ?? ((h) => clearTimeout(h as ReturnType<typeof setTimeout>));

    this.now = params?.now ?? (() =>
      typeof performance !== 'undefined' && performance.now
        ? performance.now()
        : Date.now());

    if (params?.autoStart) this.start();
  }

  addObject(obj: GameObject): void {
    this.objects.push(obj);
  }

  removeObject(obj: GameObject): void {
    const i = this.objects.indexOf(obj);
    if (i >= 0) this.objects.splice(i, 1);
  }

  getObjects(): readonly GameObject[] {
    return this.objects;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = this.now();
    this.scheduleNext();
  }

  stop(): void {
    this.running = false;
    if (this.rafHandle != null && this.caf) this.caf(this.rafHandle);
    this.rafHandle = null;
  }

  private scheduleNext(): void {
    this.rafHandle = this.raf((t) => this.gameLoop(t));
  }

  // gameLoop(timestamp) - main RAF loop
  gameLoop(timestampMs: number): void {
    if (!this.running) return;

    const dt = Math.min(250, timestampMs - this.lastTime); // clamp long frames
    this.lastTime = timestampMs;
    this.accumulator += dt;

    // Input update happens once per frame
    this.input?.updateButtonState();
    const buttonState = (this.input?.getCurrentButtonState() ?? {
      pressed: false,
      down: false,
      released: false,
      up: true,
    }) as unknown as ObjButtonState;

    // Fixed update steps for stability
    while (this.accumulator >= this.timestepMs) {
      const collisions = this.collisionDetector.checkAllCollisions(
        this.objects,
      ) as CollisionMap;
      this.updateObjects(this.objects, buttonState, collisions);
      this.handleInactiveObjects(this.objects);
      this.accumulator -= this.timestepMs;
    }

    // Render after updates
    if (this.renderer) {
      const sorted = this.sortObjectsByLayer(this.objects);
      for (const obj of sorted) obj.render(this.renderer);
    }

    this.scheduleNext();
  }

  // updateObjects(objects, buttonState, collisions)
  updateObjects(
    objects: GameObject[],
    buttonState: ObjButtonState,
    collisions: CollisionMap,
  ): void {
    for (const obj of objects) {
      const list = collisions.get(obj) ?? [];
      obj.update(buttonState, list);
    }
  }

  // handleInactiveObjects(objects) - remove inactive
  handleInactiveObjects(objects: GameObject[]): void {
    let w = 0;
    for (let r = 0; r < objects.length; r++) {
      const o = objects[r]!;
      if (o.active !== false) objects[w++] = o;
    }
    objects.length = w;
  }

  // sortObjectsByLayer(objects) - for rendering
  sortObjectsByLayer(objects: GameObject[]): GameObject[] {
    return [...objects].sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));
  }
}
