export interface ButtonState {
  pressed: boolean;
  down: boolean;
  released: boolean;
  up: boolean;
}

/** Minimal event target type to avoid depending on DOM lib types */
type ListenerTarget = {
  addEventListener?: (...args: any[]) => void;
};

export class InputManager {
  private currentDown = false;
  private prevDown = false;
  private state: ButtonState = { pressed: false, down: false, released: false, up: true };
  private attached = false;

  setupEventListeners(targets?: ListenerTarget | ListenerTarget[]): void {
    if (this.attached) return;
    const list: ListenerTarget[] = [];
    const g: any = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? (globalThis as any) : undefined);
    const d: any = typeof document !== 'undefined' ? document : undefined;

    if (Array.isArray(targets)) list.push(...targets);
    else if (targets) list.push(targets);
    else {
      if (g) list.push(g);
      if (d) list.push(d);
    }

    const onKeyDown = (e: any) => {
      const key = e?.code ?? e?.key;
      if (key === 'Space' || key === ' ' || key === 'Spacebar') {
        this.currentDown = true;
        e?.preventDefault?.();
      }
    };

    const onKeyUp = (e: any) => {
      const key = e?.code ?? e?.key;
      if (key === 'Space' || key === ' ' || key === 'Spacebar') {
        this.currentDown = false;
        e?.preventDefault?.();
      }
    };

    const onMouseDown = (e: any) => {
      this.currentDown = true;
      e?.preventDefault?.();
    };

    const onMouseUp = (e: any) => {
      this.currentDown = false;
      e?.preventDefault?.();
    };

    const onTouchStart = (e: any) => {
      this.currentDown = true;
      e?.preventDefault?.();
    };

    const onTouchEnd = (e: any) => {
      this.currentDown = false;
      e?.preventDefault?.();
    };

    for (const t of list) {
      t.addEventListener?.('keydown', onKeyDown);
      t.addEventListener?.('keyup', onKeyUp);
      t.addEventListener?.('mousedown', onMouseDown);
      t.addEventListener?.('mouseup', onMouseUp);
      t.addEventListener?.('touchstart', onTouchStart, { passive: false } as any);
      t.addEventListener?.('touchend', onTouchEnd, { passive: false } as any);
    }

    this.attached = true;
  }

  updateButtonState(): void {
    const now = this.currentDown;
    const was = this.prevDown;
    this.state = {
      pressed: now && !was,
      down: now,
      released: !now && was,
      up: !now,
    };
    this.prevDown = now;
  }

  getCurrentButtonState(): ButtonState {
    return this.state;
  }
}
