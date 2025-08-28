import { Sprite } from './sprite';

type Ctx2DLike = {
  fillStyle: string;
  imageSmoothingEnabled?: boolean;
  scale?: (x: number, y: number) => void;
  fillRect: (x: number, y: number, w: number, h: number) => void;
  clearRect?: (x: number, y: number, w: number, h: number) => void;
  textBaseline?: string;
  font?: string;
  fillText?: (text: string, x: number, y: number) => void;
};

type CanvasLike = {
  width: number;
  height: number;
  style?: { width?: string; height?: string };
  getContext: (type: '2d') => Ctx2DLike | null;
};

function isCanvasLike(el: unknown): el is CanvasLike {
  return (
    typeof el === 'object' &&
    el !== null &&
    typeof (el as { getContext?: unknown }).getContext === 'function'
  );
}

export class CanvasRenderer {
  private canvas?: CanvasLike;
  private ctx?: Ctx2DLike;
  private logicalWidth = 0;
  private logicalHeight = 0;
  private dpr = 1;

  setupCanvas(element: unknown, width: number, height: number): void {
    if (!isCanvasLike(element)) throw new Error('Invalid canvas element');
    this.canvas = element;
    this.logicalWidth = Math.max(0, Math.floor(width));
    this.logicalHeight = Math.max(0, Math.floor(height));

    const dprVal = (globalThis as unknown as { devicePixelRatio?: number }).devicePixelRatio;
    this.dpr = typeof dprVal === 'number' && dprVal > 0 ? dprVal : 1;

    // Set the internal buffer size for sharp rendering
    this.canvas.width = this.logicalWidth * this.dpr;
    this.canvas.height = this.logicalHeight * this.dpr;

    // Set CSS size to logical pixels if style is available
    if (this.canvas.style) {
      this.canvas.style.width = `${this.logicalWidth}px`;
      this.canvas.style.height = `${this.logicalHeight}px`;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not available');
    this.ctx = ctx;

    if (typeof ctx.imageSmoothingEnabled !== 'undefined') ctx.imageSmoothingEnabled = false;
    // Scale the context so our draw units are logical pixels
    ctx.scale?.(this.dpr, this.dpr);

    this.clear();
  }

  clear(): void {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
  }

  drawSprite(sprite: Sprite, x: number, y: number): void {
    if (!this.ctx) return;
    // Draw black pixels only
    this.ctx.fillStyle = '#000000';
    const h = sprite.getBounds().height;
    for (let sy = 0; sy < h; sy++) {
      const invertedSy = h - 1 - sy; // convert sprite top-origin to bottom-origin
      for (let sx = 0; sx < sprite.getBounds().width; sx++) {
        if (sprite.isPixelSolid(sx, sy)) {
          const cx = Math.floor(x + sx);
          const cy = Math.floor(this.logicalHeight - (y + invertedSy) - 1);
          this.ctx.fillRect(cx, cy, 1, 1);
        }
      }
    }
  }

  drawText(text: string, x: number, y: number): void {
    if (!this.ctx || !this.ctx.fillText) return;
    // Render UI text in black at bottom-left origin
    this.ctx.fillStyle = '#000000';
    if (typeof this.ctx.textBaseline !== 'undefined') this.ctx.textBaseline = 'bottom';
    if (typeof this.ctx.font !== 'undefined') this.ctx.font = '12px monospace';
    const cy = this.logicalHeight - y;
    this.ctx.fillText(text, x, cy);
  }
}
