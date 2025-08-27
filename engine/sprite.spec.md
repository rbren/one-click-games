engine/sprite.ts
Purpose: Sprite creation and pixel data management

```typescript
export class Sprite {
  // constructor(width, height, pixels)
  // isPixelSolid(x, y) - check if pixel is black
  // getBounds() - get width/height
}

export function createSpriteFromAscii(ascii: string): Sprite;
// Parse ASCII art into sprite data
// # = black pixel, space/other = white pixel
// Handle multi-line strings
```
