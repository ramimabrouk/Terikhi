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
  untracked,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { InteractionService } from '../core/interaction.service';
import { MotionService } from '../core/motion.service';

interface EagleState {
  x: number;
  y: number;
  angle: number;
  scale: number;
  fold: number;
  altitude: number;
  opacity: number;
}

const FOLLOW_OFFSET = { x: 30, y: 34 };

/**
 * A golden eagle seen from above that glides behind the pointer, banks toward
 * where it is heading and dives onto whatever region or option you click.
 */
@Component({
  selector: 'app-eagle-cursor',
  template: `
    <div class="shadow" #shadow aria-hidden="true"></div>
    <div class="eagle" #eagle aria-hidden="true">
      <svg viewBox="-64 -44 128 92" width="88" height="63">
        <defs>
          <linearGradient id="eagleWing" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#7a5230" />
            <stop offset="0.55" stop-color="#4a2f1b" />
            <stop offset="1" stop-color="#2a1a10" />
          </linearGradient>
          <radialGradient id="eagleHead" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stop-color="#e2b46a" />
            <stop offset="1" stop-color="#9a6a32" />
          </radialGradient>
        </defs>
        <g class="wing wing--left">
          <path
            class="wing-shape"
            d="M-5 -7 C-18 -15 -36 -18 -55 -12 L-60 -7 L-53 -5 L-58 0 L-50 0 L-53 5 L-45 4 L-46 9 L-38 7 L-36 11 C-26 11 -14 9 -5 6 Z"
          />
          <path class="wing-band" d="M-8 -3 C-20 -7 -32 -8 -44 -5" />
          <path class="wing-band wing-band--soft" d="M-10 2 C-20 1 -30 1 -40 2" />
        </g>
        <g class="wing wing--right">
          <path
            class="wing-shape"
            d="M5 -7 C18 -15 36 -18 55 -12 L60 -7 L53 -5 L58 0 L50 0 L53 5 L45 4 L46 9 L38 7 L36 11 C26 11 14 9 5 6 Z"
          />
          <path class="wing-band" d="M8 -3 C20 -7 32 -8 44 -5" />
          <path class="wing-band wing-band--soft" d="M10 2 C20 1 30 1 40 2" />
        </g>
        <path class="tail" d="M-5 13 L-10 31 Q0 36 10 31 L5 13 Z" />
        <path class="tail-band" d="M-8.6 26 Q0 30 8.6 26" />
        <ellipse class="body" cx="0" cy="2" rx="7.5" ry="15" />
        <circle class="head" cx="0" cy="-15" r="6.4" />
        <path class="beak" d="M-2.6 -19.5 Q0 -27 2.6 -19.5 Q0 -21 -2.6 -19.5 Z" />
        <circle class="eye" cx="-2.6" cy="-16.5" r="1" />
        <circle class="eye" cx="2.6" cy="-16.5" r="1" />
      </svg>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 1900;
      pointer-events: none;
      overflow: hidden;
      --flap: 0.9s;
    }

    :host(.is-hidden) {
      display: none;
    }

    .eagle,
    .shadow {
      position: absolute;
      top: 0;
      left: 0;
      will-change: transform, opacity;
    }

    .eagle svg {
      display: block;
      overflow: visible;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.25));
    }

    .shadow {
      width: 58px;
      height: 22px;
      margin: -11px 0 0 -29px;
      border-radius: 50%;
      background: radial-gradient(closest-side, rgba(34, 29, 23, 0.32), rgba(34, 29, 23, 0));
    }

    .wing {
      transform-box: view-box;
      animation: flap var(--flap) ease-in-out infinite;
    }

    .wing--left {
      transform-origin: -5px -1px;
    }

    .wing--right {
      transform-origin: 5px -1px;
      animation-name: flap-right;
    }

    :host(.is-diving) .wing {
      animation: none;
      transform: scaleX(var(--fold, 1));
    }

    .wing-shape {
      fill: url(#eagleWing);
      stroke: #24160d;
      stroke-width: 0.8;
      stroke-linejoin: round;
    }

    .wing--right .wing-shape {
      fill: url(#eagleWing);
    }

    .wing-band {
      fill: none;
      stroke: #c79a5a;
      stroke-width: 1.4;
      stroke-linecap: round;
      opacity: 0.75;
    }

    .wing-band--soft {
      stroke: #1d120a;
      stroke-width: 0.7;
      opacity: 0.6;
    }

    .tail {
      fill: #3d2716;
      stroke: #24160d;
      stroke-width: 0.8;
    }

    .tail-band {
      fill: none;
      stroke: #d9b37a;
      stroke-width: 1.6;
    }

    .body {
      fill: #5a3a20;
      stroke: #24160d;
      stroke-width: 0.8;
    }

    .head {
      fill: url(#eagleHead);
      stroke: #6b4420;
      stroke-width: 0.6;
    }

    .beak {
      fill: #f2c230;
      stroke: #8a6a10;
      stroke-width: 0.5;
    }

    .eye {
      fill: #1a120c;
    }

    @keyframes flap {
      0%,
      100% {
        transform: scale(1, 1);
      }
      50% {
        transform: scale(0.62, 1.08);
      }
    }

    @keyframes flap-right {
      0%,
      100% {
        transform: scale(1, 1);
      }
      50% {
        transform: scale(0.62, 1.08);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EagleCursorComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly interaction = inject(InteractionService);
  private readonly motion = inject(MotionService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly eagleRef = viewChild<ElementRef<HTMLElement>>('eagle');
  private readonly shadowRef = viewChild<ElementRef<HTMLElement>>('shadow');

  private readonly state: EagleState = {
    x: -200,
    y: -200,
    angle: 0,
    scale: 1,
    fold: 1,
    altitude: 1,
    opacity: 0,
  };
  private frame = 0;
  private diving = false;
  private diveTimeline: gsap.core.Timeline | null = null;
  private visible = false;
  private readonly finePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  constructor() {
    afterNextRender(() => {
      if (!this.finePointer) {
        this.host.nativeElement.classList.add('is-hidden');
        return;
      }
      this.zone.runOutsideAngular(() => {
        this.document.addEventListener('pointermove', this.onMove, { passive: true });
        this.document.documentElement.addEventListener('pointerleave', this.onLeave);
        this.frame = requestAnimationFrame(this.tick);
      });
    });

    effect(() => {
      const dive = this.interaction.dive();
      if (dive && this.finePointer)
        untracked(() => this.zone.runOutsideAngular(() => this.diveTo(dive.x, dive.y)));
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.diveTimeline?.kill();
    this.document.removeEventListener('pointermove', this.onMove);
    this.document.documentElement.removeEventListener('pointerleave', this.onLeave);
  }

  private readonly onMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const p = this.interaction.pointer;
    const now = performance.now();
    const dt = Math.max(8, now - (p.lastMove || now - 16));
    p.vx = ((event.clientX - p.x) / dt) * 16;
    p.vy = ((event.clientY - p.y) / dt) * 16;
    p.speed = Math.hypot(p.vx, p.vy);
    p.x = event.clientX;
    p.y = event.clientY;
    p.lastMove = now;
    if (!this.visible) {
      this.visible = true;
      this.state.x = p.x + FOLLOW_OFFSET.x;
      this.state.y = p.y + FOLLOW_OFFSET.y;
    }
  };

  private readonly onLeave = (): void => {
    this.visible = false;
  };

  private readonly tick = (time: number): void => {
    this.frame = requestAnimationFrame(this.tick);
    const eagle = this.eagleRef()?.nativeElement;
    const shadow = this.shadowRef()?.nativeElement;
    if (!eagle || !shadow) return;
    const s = this.state;
    const p = this.interaction.pointer;

    if (!this.diving) {
      const idle = time - p.lastMove > 260;
      // When the pointer rests, the eagle circles lazily around it.
      const orbit = idle && !this.motion.reduced() ? time / 900 : 0;
      const targetX = p.x + (idle ? Math.cos(orbit) * 34 : FOLLOW_OFFSET.x);
      const targetY = p.y + (idle ? Math.sin(orbit) * 22 + 8 : FOLLOW_OFFSET.y);
      const dx = targetX - s.x;
      const dy = targetY - s.y;
      s.x += dx * 0.12;
      s.y += dy * 0.12;
      const moving = Math.hypot(dx, dy);
      if (moving > 1.2) {
        const heading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        s.angle += shortestAngle(s.angle, heading) * 0.14;
      }
      s.opacity += ((this.visible ? 1 : 0) - s.opacity) * 0.12;
      s.altitude += (1 - s.altitude) * 0.1;
      const flap = moving > 30 ? 0.32 : moving > 8 ? 0.55 : 1.15;
      this.host.nativeElement.style.setProperty('--flap', `${flap}s`);
    }

    const bob = this.motion.reduced() ? 0 : Math.sin(time / 380) * 1.6;
    const scale = s.scale * (0.85 + s.altitude * 0.15);
    eagle.style.opacity = s.opacity.toFixed(3);
    eagle.style.transform = `translate3d(${s.x.toFixed(1)}px, ${(s.y + bob).toFixed(1)}px, 0) rotate(${s.angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    this.host.nativeElement.style.setProperty('--fold', s.fold.toFixed(3));
    const lift = 10 + s.altitude * 22;
    shadow.style.opacity = (s.opacity * (0.75 - s.altitude * 0.35)).toFixed(3);
    shadow.style.transform = `translate3d(${(s.x + lift * 0.6).toFixed(1)}px, ${(s.y + lift).toFixed(1)}px, 0) rotate(${s.angle.toFixed(1)}deg) scale(${(0.6 + s.altitude * 0.25).toFixed(3)})`;
  };

  private diveTo(x: number, y: number): void {
    if (this.motion.reduced()) return;
    const s = this.state;
    this.diveTimeline?.kill();
    this.diving = true;
    this.host.nativeElement.classList.add('is-diving');
    s.opacity = 1;
    const heading = (Math.atan2(y - s.y, x - s.x) * 180) / Math.PI + 90;
    const angle = s.angle + shortestAngle(s.angle, heading);

    this.diveTimeline = gsap
      .timeline({
        onComplete: () => {
          this.diving = false;
          this.host.nativeElement.classList.remove('is-diving');
        },
      })
      // climb and fold the wings
      .to(s, { scale: 1.35, altitude: 1.6, fold: 0.42, angle, duration: 0.16, ease: 'power2.out' })
      // stoop: fast dive onto the clicked point
      .to(s, { x, y, scale: 0.55, altitude: 0, duration: 0.34, ease: 'power3.in' })
      .add(() => this.impact(x, y))
      // pull up, wings open again
      .to(s, { scale: 1.12, altitude: 1, fold: 1, duration: 0.42, ease: 'back.out(2.2)' })
      .to(s, { scale: 1, duration: 0.25, ease: 'sine.out' });
  }

  private impact(x: number, y: number): void {
    const host = this.host.nativeElement;
    for (let i = 0; i < 2; i += 1) {
      const ring = this.document.createElement('span');
      ring.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:${2 - i * 0.8}px solid rgba(173,76,42,${0.85 - i * 0.3});pointer-events:none;`;
      host.appendChild(ring);
      ring
        .animate(
          [
            { transform: 'scale(0.4)', opacity: 1 },
            { transform: `scale(${5 + i * 3})`, opacity: 0 },
          ],
          { duration: 620 + i * 200, delay: i * 90, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' },
        )
        .finished.then(() => ring.remove())
        .catch(() => ring.remove());
    }
    for (let i = 0; i < 7; i += 1) {
      const feather = this.document.createElement('span');
      const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.5;
      const distance = 26 + Math.random() * 26;
      feather.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:9px;height:3px;margin:-1.5px 0 0 -4.5px;border-radius:60% 40%;background:${i % 2 ? '#7a5230' : '#d9b37a'};pointer-events:none;`;
      host.appendChild(feather);
      feather
        .animate(
          [
            { transform: `translate(0,0) rotate(${angle}rad)`, opacity: 1 },
            {
              transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 18}px) rotate(${angle + 3}rad)`,
              opacity: 0,
            },
          ],
          { duration: 900, easing: 'cubic-bezier(.15,.7,.4,1)', fill: 'both' },
        )
        .finished.then(() => feather.remove())
        .catch(() => feather.remove());
    }
  }
}

function shortestAngle(from: number, to: number): number {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}
