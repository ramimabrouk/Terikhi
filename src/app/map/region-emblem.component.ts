import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { LanguageService } from '../core/language.service';
import type { TunisianCity } from '../data/cities.data';
import { REGION_EMBLEMS } from '../data/emblems.data';

/**
 * When a governorate opens, its emblem bursts out of the map (e.g. a fish for
 * Bizerte), followed by a photo, then everything docks into a small card.
 */
@Component({
  selector: 'app-region-emblem',
  template: `
    @for (v of views(); track v.id) {
      <div
        class="emblem"
        [class.is-docked]="docked()"
        [attr.dir]="i18n.isArabic() ? 'rtl' : 'ltr'"
        role="status"
        data-narrate="off"
      >
        <div class="burst" aria-hidden="true">
          @for (p of particles; track $index) {
            <span
              class="particle"
              [style.--a]="p.angle + 'deg'"
              [style.--d]="p.distance + 'px'"
              [style.animation-delay.ms]="p.delay"
              >{{ v.icon }}</span
            >
          }
          <span class="rays"></span>
        </div>

        <figure class="card">
          <span class="medal" aria-hidden="true">{{ v.icon }}</span>
          <img [src]="v.photo" [alt]="v.caption" loading="eager" decoding="async" />
          <figcaption>
            <span class="eyebrow">{{ i18n.t('knownFor') }}</span>
            <strong>{{ v.name }}</strong>
            <em>{{ v.caption }}</em>
          </figcaption>
          <button type="button" class="close" [attr.aria-label]="i18n.t('close')" (click)="dismiss()">
            ×
          </button>
        </figure>
      </div>
    }
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    }

    .emblem {
      position: absolute;
      inset: 0;
    }

    .burst {
      position: absolute;
      top: 50%;
      left: 50%;
    }

    .particle {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 30px;
      line-height: 1;
      opacity: 0;
      transform: translate(-50%, -50%);
      animation: particle 1.5s cubic-bezier(0.15, 0.75, 0.3, 1) forwards;
    }

    @keyframes particle {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(0deg) scale(0.3);
      }
      15% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(var(--a)) translateY(calc(var(--d) * -1))
          rotate(calc(var(--a) * -1)) scale(1.1);
      }
    }

    .rays {
      position: absolute;
      top: 0;
      left: 0;
      width: 340px;
      height: 340px;
      margin: -170px 0 0 -170px;
      border-radius: 50%;
      background: repeating-conic-gradient(rgba(255, 244, 214, 0.55) 0 8deg, transparent 8deg 22deg);
      mask: radial-gradient(closest-side, #000 30%, transparent);
      opacity: 0;
      animation: rays 1.6s ease-out forwards;
    }

    @keyframes rays {
      0% {
        opacity: 0;
        transform: scale(0.2) rotate(0deg);
      }
      30% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: scale(1.2) rotate(60deg);
      }
    }

    .card {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      width: 250px;
      margin: 0;
      padding: 10px 10px 12px;
      background: #fffdf8;
      box-shadow:
        0 18px 40px rgba(34, 29, 23, 0.28),
        0 2px 0 rgba(34, 29, 23, 0.1);
      pointer-events: auto;
      transform: translate(-50%, -50%) rotate(-3deg);
      animation: card-in 0.75s 0.35s cubic-bezier(0.2, 1.5, 0.4, 1) both;
      transition:
        top 0.7s var(--ease-inout),
        left 0.7s var(--ease-inout),
        width 0.7s var(--ease-inout),
        transform 0.7s var(--ease-inout);
    }

    @keyframes card-in {
      from {
        opacity: 0;
        transform: translate(-50%, -20%) rotate(12deg) scale(0.4);
      }
    }

    .medal {
      position: absolute;
      top: -30px;
      left: 50%;
      z-index: 2;
      display: grid;
      place-items: center;
      width: 62px;
      height: 62px;
      margin-left: -31px;
      border: 2px solid #d4a23c;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #fff8e6, #f0d9a6);
      box-shadow: 0 6px 16px rgba(34, 29, 23, 0.25);
      font-size: 34px;
      line-height: 1;
      animation: medal 0.9s cubic-bezier(0.2, 1.8, 0.4, 1) both;
    }

    @keyframes medal {
      0% {
        transform: scale(0) rotate(-120deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
      }
    }

    img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      background: var(--paper-deep);
    }

    figcaption {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-top: 10px;
    }

    figcaption strong {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 400;
      line-height: 1.05;
    }

    figcaption em {
      font-size: 14px;
      line-height: 1.3;
      color: var(--terracotta-deep);
    }

    .close {
      position: absolute;
      top: 4px;
      right: 6px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 253, 248, 0.92);
      font-size: 18px;
      line-height: 1;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .is-docked .close {
      right: auto;
      left: 6px;
      opacity: 1;
    }

    [dir='rtl'].is-docked .close {
      right: 6px;
      left: auto;
    }

    .is-docked .card {
      top: 18px;
      left: 18px;
      width: 170px;
      transform: translate(0, 0) rotate(-2deg);
    }

    .is-docked .medal {
      top: -18px;
      left: auto;
      right: -14px;
      width: 42px;
      height: 42px;
      margin: 0;
      font-size: 22px;
    }

    .is-docked figcaption strong {
      font-size: 17px;
    }

    .is-docked figcaption em {
      font-size: 12.5px;
    }

    [dir='rtl'] .card {
      transform: translate(50%, -50%) rotate(3deg);
      left: auto;
      right: 50%;
    }

    [dir='rtl'].is-docked .card {
      right: 18px;
      transform: translate(0, 0) rotate(2deg);
    }

    @media (max-width: 900px) {
      .card {
        width: 190px;
      }

      .is-docked .card {
        top: 10px;
        left: 10px;
        width: 120px;
        padding: 6px;
      }

      .is-docked figcaption em,
      .is-docked figcaption .eyebrow {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .particle,
      .rays {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionEmblemComponent implements OnDestroy {
  readonly i18n = inject(LanguageService);
  readonly city = input<TunisianCity | null>(null);
  readonly dismissed = output<void>();

  readonly docked = signal(false);
  private readonly hidden = signal<string | null>(null);
  private timer: number | null = null;

  readonly particles = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30 + (i % 2 ? 8 : -6),
    distance: 120 + (i % 3) * 45,
    delay: (i % 4) * 40,
  }));

  readonly view = computed(() => {
    const city = this.city();
    if (!city || this.hidden() === city.id) return null;
    const emblem = REGION_EMBLEMS[city.id];
    if (!emblem) return null;
    const arabic = this.i18n.isArabic();
    return {
      id: city.id,
      icon: emblem.icon,
      photo: emblem.photo,
      name: arabic ? city.nameAr : city.name,
      caption: arabic ? emblem.ar : emblem.fr,
    };
  });

  readonly views = computed(() => {
    const view = this.view();
    return view ? [view] : [];
  });

  constructor() {
    effect(() => {
      const id = this.city()?.id ?? null;
      untracked(() => {
        this.docked.set(false);
        this.hidden.set(null);
        if (this.timer !== null) window.clearTimeout(this.timer);
        if (!id) return;
        this.timer = window.setTimeout(() => this.docked.set(true), 3200);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.timer !== null) window.clearTimeout(this.timer);
  }

  dismiss(): void {
    const id = this.city()?.id;
    if (id) this.hidden.set(id);
    this.dismissed.emit();
  }
}
