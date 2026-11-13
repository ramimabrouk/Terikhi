import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { NarratorService } from '../core/narrator.service';

@Component({
  selector: 'app-narration-control',
  template: `
    <div class="narration" data-narrate="off">
      <button
        type="button"
        class="toggle"
        [class.is-on]="narrator.enabled()"
        [class.is-speaking]="narrator.speaking()"
        [attr.aria-pressed]="narrator.enabled()"
        [attr.aria-label]="narrator.enabled() ? i18n.t('narrationOn') : i18n.t('narrationOff')"
        (click)="narrator.toggle()"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path class="spk" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
          @if (narrator.enabled()) {
            <path class="wave w1" d="M15 9.2a4 4 0 0 1 0 5.6" />
            <path class="wave w2" d="M17.6 6.8a7.4 7.4 0 0 1 0 10.4" />
          } @else {
            <path class="wave" d="M16 9.5l5 5M21 9.5l-5 5" />
          }
        </svg>
        <span class="toggle-label">{{ i18n.t('narration') }}</span>
      </button>
      <button
        type="button"
        class="more"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="i18n.t('voice')"
        (click)="open.set(!open())"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
      </button>

      @if (open()) {
        <div class="panel" role="dialog" [attr.aria-label]="i18n.t('voice')">
          @if (!narrator.supported || narrator.currentVoices().length === 0) {
            <p class="empty">{{ i18n.t('noVoice') }}</p>
          } @else {
            <label class="field">
              <span class="eyebrow">{{ i18n.t('voice') }}</span>
              <select [value]="narrator.currentVoiceName()" (change)="pick($event)">
                @for (voice of narrator.currentVoices(); track voice.name) {
                  <option [value]="voice.name" [selected]="voice.name === narrator.currentVoiceName()">
                    {{ voice.name }} · {{ voice.lang }}
                  </option>
                }
              </select>
            </label>
            <label class="field">
              <span class="eyebrow">{{ i18n.t('speed') }} · {{ narrator.rate().toFixed(2) }}×</span>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                [value]="narrator.rate()"
                (input)="rate($event)"
              />
            </label>
            <button type="button" class="test" (click)="test()">▶ {{ i18n.t('testVoice') }}</button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .narration {
      position: relative;
      display: flex;
      align-items: center;
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 0 8px;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-3);
      transition: color 0.2s;
    }

    .toggle.is-on {
      color: var(--terracotta);
    }

    .toggle svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .spk {
      fill: currentColor;
      fill-opacity: 0.15;
    }

    .is-speaking .wave {
      animation: pulse 0.7s ease-in-out infinite alternate;
    }

    .is-speaking .w2 {
      animation-delay: 0.2s;
    }

    @keyframes pulse {
      from {
        opacity: 0.25;
      }
      to {
        opacity: 1;
      }
    }

    .more {
      display: grid;
      place-items: center;
      width: 26px;
      height: 44px;
      color: var(--ink-3);
    }

    .more svg {
      width: 12px;
      height: 12px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.2;
    }

    .panel {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 300px;
      padding: 16px;
      border: 1px solid var(--ink);
      background: var(--paper-soft);
      box-shadow: 8px 8px 0 rgba(34, 29, 23, 0.1);
      animation: drop 0.28s var(--ease-out) both;
    }

    :host-context([dir='rtl']) .panel {
      right: auto;
      left: 0;
    }

    @keyframes drop {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    select {
      width: 100%;
      min-height: 38px;
      padding: 0 8px;
      border: 1px solid var(--line);
      border-radius: 0;
      background: var(--paper);
      font-family: var(--font-body);
      font-size: 14px;
    }

    input[type='range'] {
      accent-color: var(--terracotta);
    }

    .test {
      align-self: flex-start;
      min-height: 36px;
      padding: 0 12px;
      border: 1px solid var(--ink);
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .test:hover {
      background: var(--ink);
      color: var(--paper-soft);
    }

    .empty {
      font-size: 14px;
      font-style: italic;
      color: var(--ink-3);
    }

    @media (max-width: 900px) {
      .toggle-label {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarrationControlComponent {
  readonly narrator = inject(NarratorService);
  readonly i18n = inject(LanguageService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly open = signal(false);

  @HostListener('document:pointerdown', ['$event'])
  onOutside(event: PointerEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  pick(event: Event): void {
    this.narrator.chooseVoice((event.target as HTMLSelectElement).value);
    this.test();
  }

  rate(event: Event): void {
    this.narrator.setRate(Number((event.target as HTMLInputElement).value));
  }

  test(): void {
    this.narrator.say(this.i18n.t('meetGuide'), { force: true, priority: true });
  }
}
