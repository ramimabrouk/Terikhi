import { DestroyRef, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly query: MediaQueryList | null =
    typeof window === 'undefined'
      ? null
      : window.matchMedia('(prefers-reduced-motion: reduce)');

  readonly reduced = signal(this.query?.matches ?? false);

  constructor() {
    const query = this.query;
    if (!query) return;
    const onChange = (event: MediaQueryListEvent): void => this.reduced.set(event.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }
}
