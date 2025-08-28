export interface ButtonState {
  pressed: boolean;
  down: boolean;
  released: boolean;
  up: boolean;
}

// Minimal event target type to avoid depending on DOM lib types
type AddEventListener = (
  type: string,
  listener: (ev: unknown) => void,
  options?: unknown
) => void;

type ListenerTarget = {
  addEventListener?: AddEventListener;
};

type BasicEvent = { preventDefault?: () => void };

type KeyEventLike = BasicEvent & Partial<{ code: string; key: string }>;

function isListenerTarget(t: unknown): t is ListenerTarget {
  return (
    typeof t === 'object' &&
    t !== null &&
    typeof (t as { addEventListener?: unknown }).addEventListener === 'function'
  );
}

export class InputManager {
  private currentDown = false;
  private prevDown = false;
  private state: ButtonState = { pressed: false, down: false, released: false, up: true };
  private attached = false;

  setupEventListeners(targets?: ListenerTarget | ListenerTarget[]): void {
    if (this.attached) return;
    const list: ListenerTarget[] = [];

    if (Array.isArray(targets)) list.push(...targets);
    else if (targets) list.push(targets);

    const gt: unknown = globalThis;
    if (isListenerTarget(gt)) list.push(gt);

    const onKeyDown = (e: unknown) => {
      const keyEvent = e as KeyEventLike;
      const key = keyEvent.code ?? keyEvent.key;
      if (key === 'Space' || key === ' ' || key === 'Spacebar') {
        this.currentDown = true;
        keyEvent.preventDefault?.();
      }
    };

    const onKeyUp = (e: unknown) => {
      const keyEvent = e as KeyEventLike;
      const key = keyEvent.code ?? keyEvent.key;
      if (key === 'Space' || key === ' ' || key === 'Spacebar') {
        this.currentDown = false;
        keyEvent.preventDefault?.();
      }
    };

    const onMouseDown = (e: unknown) => {
      const mouseEvent = e as BasicEvent;
      this.currentDown = true;
      mouseEvent.preventDefault?.();
    };

    const onMouseUp = (e: unknown) => {
      const mouseEvent = e as BasicEvent;
      this.currentDown = false;
      mouseEvent.preventDefault?.();
    };

    const onTouchStart = (e: unknown) => {
      const touchEvent = e as BasicEvent;
      this.currentDown = true;
      touchEvent.preventDefault?.();
    };

    const onTouchEnd = (e: unknown) => {
      const touchEvent = e as BasicEvent;
      this.currentDown = false;
      touchEvent.preventDefault?.();
    };

    for (const t of list) {
      t.addEventListener?.('keydown', onKeyDown);
      t.addEventListener?.('keyup', onKeyUp);
      t.addEventListener?.('mousedown', onMouseDown);
      t.addEventListener?.('mouseup', onMouseUp);
      t.addEventListener?.('touchstart', onTouchStart, { passive: false });
      t.addEventListener?.('touchend', onTouchEnd, { passive: false });
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
