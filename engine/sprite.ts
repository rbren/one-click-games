export class Sprite {
  readonly width: number;
  readonly height: number;
  readonly pixels: number[][]; // 1 = black (solid), 0 = white (empty)

  constructor(width: number, height: number, pixels: number[][]) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  isPixelSolid(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    return this.pixels[y]?.[x] === 1;
  }

  getBounds(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}

export function createSpriteFromAscii(ascii: string): Sprite {
  const lines = ascii.replace(/\r/g, '').split('\n');
  const height = lines.length;
  const width = lines.reduce((max, line) => Math.max(max, line.length), 0);

  const pixels: number[][] = new Array(height);
  for (let y = 0; y < height; y++) {
    const line = lines[y] ?? '';
    const row: number[] = new Array(width);
    for (let x = 0; x < width; x++) {
      const ch = line.charAt(x);
      row[x] = ch === '#' ? 1 : 0;
    }
    pixels[y] = row;
  }

  return new Sprite(width, height, pixels);
}
