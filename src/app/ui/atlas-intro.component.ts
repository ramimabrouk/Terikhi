import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnDestroy,
  inject,
  output,
  signal,
} from '@angular/core';
import { MotionService } from '../core/motion.service';
import { LanguageService } from '../core/language.service';

@Component({
  selector: 'app-atlas-intro',
  templateUrl: './atlas-intro.component.html',
  styleUrl: './atlas-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtlasIntroComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly motion = inject(MotionService);
  readonly i18n = inject(LanguageService);

  readonly exitStarted = output<void>();
  readonly closed = output<void>();
  readonly leaving = signal(false);

  private timeoutId: number | null = null;

  constructor() {
    this.document.addEventListener('keydown', this.onKeydown);
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('keydown', this.onKeydown);
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }
  }

  dismiss(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    this.exitStarted.emit();
    const delay = this.motion.reduced() ? 240 : 880;
    this.timeoutId = window.setTimeout(() => this.closed.emit(), delay);
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.dismiss();
  };
}
