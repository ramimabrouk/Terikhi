import { Injectable, signal } from '@angular/core';

export type Mood =
  | 'idle'
  | 'curious'
  | 'happy'
  | 'surprised'
  | 'focused'
  | 'cheer'
  | 'sleepy';

export interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  lastMove: number;
}

export interface DiveRequest {
  x: number;
  y: number;
  kind: 'region' | 'option';
  id: number;
}

/**
 * Small event bus shared by the avatar, the eagle and the effect layer.
 * Pointer data is a plain mutable object (read inside requestAnimationFrame
 * loops, outside Angular) to avoid a change-detection pass per mouse move.
 */
@Injectable({ providedIn: 'root' })
export class InteractionService {
  readonly pointer: PointerState = {
    x: typeof window === 'undefined' ? 0 : window.innerWidth / 2,
    y: typeof window === 'undefined' ? 0 : window.innerHeight / 2,
    vx: 0,
    vy: 0,
    speed: 0,
    lastMove: 0,
  };

  readonly mood = signal<Mood>('idle');
  readonly dive = signal<DiveRequest | null>(null);
  readonly celebrate = signal(0);
  /** Text copied through an in-app "copy" button (the native copy event is caught separately). */
  readonly copied = signal<{ text: string; id: number } | null>(null);
  private moodTimer: number | null = null;
  private diveId = 0;

  /** Show a mood for a while, then fall back to idle. */
  react(mood: Mood, duration = 1400): void {
    this.mood.set(mood);
    if (this.moodTimer !== null) window.clearTimeout(this.moodTimer);
    this.moodTimer = window.setTimeout(() => {
      this.moodTimer = null;
      this.mood.set('idle');
    }, duration);
  }

  requestDive(x: number, y: number, kind: DiveRequest['kind']): void {
    this.diveId += 1;
    this.dive.set({ x, y, kind, id: this.diveId });
  }

  notifyCopy(text: string): void {
    this.diveId += 1;
    this.copied.set({ text, id: this.diveId });
  }

  party(): void {
    this.celebrate.update((n) => n + 1);
    this.react('cheer', 4200);
  }
}
