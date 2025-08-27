import { describe, it, expect, vi } from 'vitest';
import { startEngine } from '../src/index';

describe('engine', () => {
  it('logs hello world', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    startEngine();
    expect(spy).toHaveBeenCalledWith('hello world');
    spy.mockRestore();
  });
});
