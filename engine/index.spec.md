engine/index.ts
Purpose: Main entry point and engine orchestration

```typescript
export class OneClickEngine {
  // Core engine initialization and public API
  // Combines all subsystems (canvas, input, objects, etc.)
  // Exposes methods: start(), stop(), addObject(), removeObject()
}

export { GameObject } from './object';
export { Sprite, createSpriteFromAscii } from './sprite';
export * from './types';
```
