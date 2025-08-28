import { describe, it, expect } from 'vitest';
import { OneClickEngine, GameObject, Sprite, createSpriteFromAscii } from '../src/index';

describe('engine', () => {
  it('can create OneClickEngine instance', () => {
    const engine = new OneClickEngine();
    expect(engine).toBeInstanceOf(OneClickEngine);
  });

  it('can create sprites from ASCII', () => {
    const ascii = `##
#.`;
    const sprite = createSpriteFromAscii(ascii);
    expect(sprite).toBeInstanceOf(Sprite);
    expect(sprite.width).toBe(2);
    expect(sprite.height).toBe(2);
    expect(sprite.isPixelSolid(0, 0)).toBe(true);
    expect(sprite.isPixelSolid(1, 0)).toBe(true);
    expect(sprite.isPixelSolid(0, 1)).toBe(true);
    expect(sprite.isPixelSolid(1, 1)).toBe(false);
  });

  it('can add and remove game objects', () => {
    const engine = new OneClickEngine();
    
    class TestObject extends GameObject {
      update() {
        // Test implementation
      }
    }
    
    const obj = new TestObject(10, 20);
    expect(engine.getObjects()).toHaveLength(0);
    
    engine.addObject(obj);
    expect(engine.getObjects()).toHaveLength(1);
    expect(engine.getObjects()[0]).toBe(obj);
    
    engine.removeObject(obj);
    expect(engine.getObjects()).toHaveLength(0);
  });

  it('throws error when starting without initialization', () => {
    const engine = new OneClickEngine();
    expect(() => engine.start()).toThrow('Engine must be initialized before starting. Call init() first.');
  });
});
