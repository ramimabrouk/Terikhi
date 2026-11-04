import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-hannibal-card',
  templateUrl: './hannibal-card.component.html',
  styleUrl: './hannibal-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HannibalCardComponent {
  readonly isOpen = signal(false);
  readonly imageX = signal(0);
  readonly imageY = signal(0);

  toggleDetails(): void {
    this.isOpen.update((open) => !open);
  }

  moveImage(event: PointerEvent): void {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const bounds = target.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    this.imageX.set(Math.max(-1, Math.min(1, x)));
    this.imageY.set(Math.max(-1, Math.min(1, y)));
  }

  resetImage(): void {
    this.imageX.set(0);
    this.imageY.set(0);
  }
}
