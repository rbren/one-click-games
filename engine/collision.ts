import { Sprite } from './sprite.js';

export type CollisionMap<T extends Collidable = Collidable> = Map<T, T[]>;

export interface Collidable {
  x: number;
  y: number;
  active?: boolean;
  getCurrentSprite(): Sprite | undefined;
}

function overlapRect(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): { x0: number; y0: number; x1: number; y1: number } | null {
  const x0 = Math.max(ax, bx);
  const y0 = Math.max(ay, by);
  const x1 = Math.min(ax + aw, bx + bw);
  const y1 = Math.min(ay + ah, by + bh);
  if (x0 >= x1 || y0 >= y1) return null;
  return { x0, y0, y1, x1 };
}

export class CollisionDetector {
  checkCollision(a: Collidable, b: Collidable): boolean {
    if ((a.active === false) || (b.active === false)) return false;

    const sa = a.getCurrentSprite();
    const sb = b.getCurrentSprite();
    if (!sa || !sb) return false;

    const { width: aw, height: ah } = sa.getBounds();
    const { width: bw, height: bh } = sb.getBounds();

    const rect = overlapRect(a.x, a.y, aw, ah, b.x, b.y, bw, bh);
    if (!rect) return false;

    const { x0, y0, x1, y1 } = rect;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const ax = x - a.x;
        const ay = y - a.y;
        const bx = x - b.x;
        const by = y - b.y;
        if (sa.isPixelSolid(ax, ay) && sb.isPixelSolid(bx, by)) return true;
      }
    }
    return false;
  }

  checkAllCollisions<T extends Collidable>(objects: T[]): CollisionMap<T> {
    const result: CollisionMap<T> = new Map();

    const n = objects.length;
    for (let i = 0; i < n; i++) {
      const a = objects[i]!;
      if (a.active === false || !a.getCurrentSprite()) continue;
      for (let j = i + 1; j < n; j++) {
        const b = objects[j]!;
        if (b.active === false || !b.getCurrentSprite()) continue;
        if (this.checkCollision(a, b)) {
          if (!result.has(a)) result.set(a as T, []);
          if (!result.has(b)) result.set(b as T, []);
          result.get(a)!.push(b as T);
          result.get(b)!.push(a as T);
        }
      }
    }

    return result;
  }
}
