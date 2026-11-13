import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { InteractionService } from '../core/interaction.service';
import { LanguageService } from '../core/language.service';
import { MotionService } from '../core/motion.service';
import { NarratorService } from '../core/narrator.service';

const INTERACTIVE =
  'button, a[href], [role="button"], .chip, select, input[type="checkbox"], input[type="range"], summary';

/**
 * Global feedback layer: click ripples, letters that float out of the field
 * you type in, a toast when something is copied, and confetti for victories.
 * Everything is created imperatively with the Web Animations API, outside
 * Angular, and removed when its animation finishes.
 */
@Component({
  selector: 'app-fx-layer',
  template: `
    @if (toast(); as message) {
      <div class="toast" role="status">
        <span class="toast-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="7" y="3" width="12" height="15" rx="2" />
            <path d="M5 7v12a2 2 0 0 0 2 2h9" />
            <path class="tick" d="M10 11l2.4 2.4L16.5 9" />
          </svg>
        </span>
        <span class="toast-copy">
          <strong>{{ message.title }}</strong>
          @if (message.excerpt) {
            <em>« {{ message.excerpt }} »</em>
          }
        </span>
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 1950;
      pointer-events: none;
      overflow: hidden;
    }

    .toast {
      position: absolute;
      left: 50%;
      bottom: 28px;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: min(440px, calc(100vw - 32px));
      padding: 12px 18px 12px 12px;
      border: 1px solid var(--ink);
      background: var(--paper-soft);
      box-shadow: 6px 6px 0 rgba(34, 29, 23, 0.14);
      transform: translateX(-50%);
      animation: toast-in 0.55s cubic-bezier(0.2, 1.4, 0.4, 1) both;
    }

    .toast-icon {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--terracotta);
      color: var(--paper-soft);
      animation: icon-pop 0.6s 0.15s cubic-bezier(0.2, 1.6, 0.4, 1) both;
    }

    .toast-icon svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .tick {
      stroke-dasharray: 12;
      stroke-dashoffset: 12;
      animation: tick 0.4s 0.45s ease-out forwards;
    }

    .toast-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .toast-copy strong {
      font-family: var(--font-mono);
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .toast-copy em {
      overflow: hidden;
      font-size: 14px;
      color: var(--ink-2);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translate(-50%, 40px) scale(0.9);
      }
    }

    @keyframes icon-pop {
      from {
        transform: scale(0) rotate(-40deg);
      }
    }

    @keyframes tick {
      to {
        stroke-dashoffset: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FxLayerComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly interaction = inject(InteractionService);
  private readonly motion = inject(MotionService);
  private readonly i18n = inject(LanguageService);
  private readonly narrator = inject(NarratorService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly toast = signal<{ title: string; excerpt: string } | null>(null);
  private toastTimer: number | null = null;
  private canvas: CanvasRenderingContext2D | null = null;
  private lastCelebrate = 0;

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        this.document.addEventListener('pointerdown', this.onPointerDown, true);
        this.document.addEventListener('input', this.onInput, true);
      });
      this.document.addEventListener('copy', this.onCopy);
    });

    effect(() => {
      const copied = this.interaction.copied();
      if (copied) untracked(() => this.showCopyToast(copied.text, null));
    });

    effect(() => {
      const count = this.interaction.celebrate();
      if (count > this.lastCelebrate) {
        this.lastCelebrate = count;
        untracked(() => this.zone.runOutsideAngular(() => this.confetti()));
      }
    });
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('pointerdown', this.onPointerDown, true);
    this.document.removeEventListener('input', this.onInput, true);
    this.document.removeEventListener('copy', this.onCopy);
    if (this.toastTimer !== null) window.clearTimeout(this.toastTimer);
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-fx="off"]')) return;
    const region = target.closest('path.gov');
    const option = region ? null : target.closest(INTERACTIVE);
    if (!region && !option) return;

    this.ripple(event.clientX, event.clientY, region ? 'region' : 'option');
    this.zone.run(() => {
      this.interaction.requestDive(event.clientX, event.clientY, region ? 'region' : 'option');
      this.interaction.react('surprised', 700);
    });
  };

  private readonly onInput = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (target.type === 'range' || target.type === 'checkbox') return;
    const input = event as InputEvent;
    const char = input.data ? input.data.slice(-1) : input.inputType.startsWith('delete') ? '⌫' : '';
    this.zone.run(() => this.interaction.react('focused', 1600));
    if (!char || this.motion.reduced()) return;

    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    const before = target.value.slice(0, target.selectionStart ?? target.value.length);
    const width = this.measure(before, style.font);
    const rtl = style.direction === 'rtl';
    const padStart = parseFloat(rtl ? style.paddingRight : style.paddingLeft) || 0;
    const caretX = rtl
      ? rect.right - padStart - Math.min(width, rect.width - padStart)
      : rect.left + padStart + Math.min(width, rect.width - padStart - 4);
    const caretY = rect.top + rect.height / 2;
    this.floatLetter(char, caretX, caretY, style.fontSize);
  };

  private readonly onCopy = (): void => {
    const selection = this.document.getSelection();
    const text = selection?.toString().trim() ?? '';
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    this.showCopyToast(text, range?.getBoundingClientRect() ?? null);
  };

  private showCopyToast(text: string, from: DOMRect | null): void {
    const excerpt = text.length > 46 ? `${text.slice(0, 44)}…` : text;
    this.toast.set(null);
    queueMicrotask(() => this.toast.set({ title: this.i18n.t('copied'), excerpt }));
    this.interaction.react('happy', 1600);
    this.narrator.say(this.i18n.t('copied'), { priority: true });
    if (this.toastTimer !== null) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.set(null), 2600);

    const active = this.document.activeElement;
    const rect =
      from && from.width > 0
        ? from
        : active instanceof HTMLElement
          ? active.getBoundingClientRect()
          : null;
    if (rect && rect.width > 0 && !this.motion.reduced()) {
      this.zone.runOutsideAngular(() => this.flyToToast(excerpt || '✓', rect));
    }
  }

  private ripple(x: number, y: number, kind: 'region' | 'option'): void {
    if (this.motion.reduced()) return;
    const color = kind === 'region' ? '173,76,42' : '44,52,102';
    const dot = this.spawn(
      `left:${x}px;top:${y}px;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:rgba(${color},.35);`,
    );
    this.play(dot, [{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(4.5)', opacity: 0 }], 520);
    const sparks = kind === 'region' ? 10 : 6;
    for (let i = 0; i < sparks; i += 1) {
      const angle = (Math.PI * 2 * i) / sparks;
      const distance = kind === 'region' ? 34 : 22;
      const spark = this.spawn(
        `left:${x}px;top:${y}px;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:${i % 2 ? 'var(--sand)' : `rgb(${color})`};`,
      );
      this.play(
        spark,
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(.2)`,
            opacity: 0,
          },
        ],
        560,
      );
    }
  }

  private floatLetter(char: string, x: number, y: number, fontSize: string): void {
    const letter = this.spawn(
      `left:${x}px;top:${y}px;font-family:var(--font-display);font-size:${parseFloat(fontSize) * 1.5}px;line-height:1;color:var(--terracotta);font-style:italic;white-space:pre;transform:translate(-50%,-50%);`,
    );
    letter.textContent = char;
    const drift = (Math.random() - 0.5) * 40;
    this.play(
      letter,
      [
        { transform: 'translate(-50%,-50%) scale(.6) rotate(0deg)', opacity: 0 },
        { transform: 'translate(-50%,-90%) scale(1.25) rotate(-6deg)', opacity: 1, offset: 0.25 },
        {
          transform: `translate(calc(-50% + ${drift}px), -260%) scale(.8) rotate(${drift / 2}deg)`,
          opacity: 0,
        },
      ],
      900,
    );
    for (let i = 0; i < 3; i += 1) {
      const dust = this.spawn(
        `left:${x}px;top:${y}px;width:3px;height:3px;border-radius:50%;background:var(--sand);`,
      );
      this.play(
        dust,
        [
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: `translate(${(Math.random() - 0.5) * 30}px, ${-10 - Math.random() * 24}px)`, opacity: 0 },
        ],
        600,
      );
    }
  }

  private flyToToast(text: string, from: DOMRect): void {
    const chip = this.spawn(
      `left:${from.left + from.width / 2}px;top:${from.top + from.height / 2}px;max-width:280px;padding:6px 10px;background:var(--terracotta);color:var(--paper-soft);font-family:var(--font-body);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 8px 20px rgba(0,0,0,.18);`,
    );
    chip.textContent = text;
    const toX = window.innerWidth / 2 - (from.left + from.width / 2);
    const toY = window.innerHeight - 60 - (from.top + from.height / 2);
    this.play(
      chip,
      [
        { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 0.95 },
        { transform: `translate(calc(-50% + ${toX * 0.4}px), calc(-50% + ${toY * 0.1 - 60}px)) scale(.9) rotate(-8deg)`, opacity: 1, offset: 0.4 },
        { transform: `translate(calc(-50% + ${toX}px), calc(-50% + ${toY}px)) scale(.2) rotate(10deg)`, opacity: 0 },
      ],
      700,
    );
  }

  private confetti(): void {
    if (this.motion.reduced()) return;
    const colors = ['#e70013', '#ffffff', '#e70013', '#c9a166', '#ad4c2a'];
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 140; i += 1) {
      const fromLeft = i % 2 === 0;
      const x0 = fromLeft ? -10 : w + 10;
      const y0 = h * (0.55 + Math.random() * 0.4);
      const piece = this.spawn(
        `left:${x0}px;top:${y0}px;width:${6 + Math.random() * 6}px;height:${10 + Math.random() * 8}px;background:${colors[i % colors.length]};border:${i % 5 === 1 ? '1px solid #e70013' : '0'};`,
      );
      const peakX = (fromLeft ? 1 : -1) * (w * (0.2 + Math.random() * 0.45));
      const peakY = -h * (0.45 + Math.random() * 0.4);
      const spin = 360 + Math.random() * 720;
      this.play(
        piece,
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${peakX * 0.75}px, ${peakY}px) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${peakX}px, ${peakY + h * 0.9}px) rotate(${spin}deg)`, opacity: 0.2 },
        ],
        2200 + Math.random() * 1400,
        Math.random() * 300,
      );
    }
  }

  private spawn(css: string): HTMLSpanElement {
    const el = this.document.createElement('span');
    el.style.cssText = `position:absolute;pointer-events:none;${css}`;
    this.host.nativeElement.appendChild(el);
    return el;
  }

  private play(el: HTMLElement, frames: Keyframe[], duration: number, delay = 0): void {
    el.animate(frames, {
      duration,
      delay,
      easing: 'cubic-bezier(.2,.7,.3,1)',
      fill: 'both',
    })
      .finished.then(() => el.remove())
      .catch(() => el.remove());
  }

  private measure(text: string, font: string): number {
    if (!this.canvas) this.canvas = this.document.createElement('canvas').getContext('2d');
    if (!this.canvas) return text.length * 8;
    this.canvas.font = font;
    return this.canvas.measureText(text).width;
  }
}
