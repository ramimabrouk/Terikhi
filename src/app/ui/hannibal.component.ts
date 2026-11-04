import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  signal,
  viewChild,
} from '@angular/core';

interface Eye {
  cx: number;
  cy: number;
}

interface Pupil {
  cx: number;
  cy: number;
}

const LEFT_EYE: Eye = { cx: 88, cy: 108 };
const RIGHT_EYE: Eye = { cx: 152, cy: 108 };
const ORBIT_RADIUS = 18;
const PUPIL_RADIUS = 8;
const MAX_PUPIL_OFFSET = ORBIT_RADIUS - PUPIL_RADIUS;

@Component({
  selector: 'app-hannibal',
  standalone: true,
  template: `
    <section class="hannibal" aria-labelledby="hannibal-title">
      <header class="hannibal-header">
        <p class="eyebrow">Avatar interactif</p>
        <h2 id="hannibal-title">Hannibal <em>Barca</em></h2>
      </header>

      <div class="avatar-stage">
        <svg
          #avatarSvg
          class="avatar"
          viewBox="0 0 240 280"
          role="img"
          aria-label="Avatar SVG de Hannibal Barca dont les yeux suivent le curseur"
        >
          <defs>
            <linearGradient id="skin" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0" stop-color="#e4b487" />
              <stop offset="1" stop-color="#bd795c" />
            </linearGradient>
            <linearGradient id="tunic" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#315866" />
              <stop offset="1" stop-color="#1d3542" />
            </linearGradient>
          </defs>

          <path
            class="shoulders"
            d="M25 280c7-49 37-72 95-72s88 23 95 72z"
          />
          <path class="tunic" d="M64 215l56 30 56-30 20 65H44z" />
          <path class="drape" d="M58 220l62 39 62-39-11-18H69z" />

          <path
            class="face"
            d="M57 92c0-45 26-70 63-70s63 25 63 70v49c0 49-27 79-63 79s-63-30-63-79z"
          />
          <path class="hair" d="M53 97c-8-35 5-78 45-88 33-8 71 8 83 40l-16 18-13-19-9 22-18-22-17 24-19-16-11 27z" />
          <path class="brow" d="M69 94q19-16 38 0M133 94q19-16 38 0" />

          <circle class="orbit" [attr.cx]="LEFT_EYE.cx" [attr.cy]="LEFT_EYE.cy" [attr.r]="ORBIT_RADIUS" />
          <circle class="orbit" [attr.cx]="RIGHT_EYE.cx" [attr.cy]="RIGHT_EYE.cy" [attr.r]="ORBIT_RADIUS" />
          <circle class="pupil" [attr.cx]="leftPupil().cx" [attr.cy]="leftPupil().cy" [attr.r]="PUPIL_RADIUS" />
          <circle class="pupil" [attr.cx]="rightPupil().cx" [attr.cy]="rightPupil().cy" [attr.r]="PUPIL_RADIUS" />
          <circle class="glint" [attr.cx]="leftPupil().cx - 2.5" [attr.cy]="leftPupil().cy - 2.5" r="2" />
          <circle class="glint" [attr.cx]="rightPupil().cx - 2.5" [attr.cy]="rightPupil().cy - 2.5" r="2" />

          <path class="nose" d="M119 111c-2 17-8 30-3 35 5 4 12 3 17-1" />
          <path class="moustache" d="M120 159q-13-10-25 0 12 13 25 2 13 11 25-2-12-10-25 0z" />
          <path class="mouth" d="M103 177q17 8 34 0" />
          <path class="collar" d="M89 213l31 32 31-32" />
        </svg>
      </div>

      <p class="hint">Déplacez le curseur pour guider le regard.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: min(360px, 100%);
    }

    .hannibal {
      overflow: hidden;
      border: 1px solid var(--line, #d7cbbb);
      background: var(--paper-soft, #f7f1e6);
      color: var(--ink, #221d17);
    }

    .hannibal-header {
      padding: 14px 16px 12px;
      border-bottom: 1px solid var(--line, #d7cbbb);
    }

    h2 {
      margin-top: 4px;
      font-family: var(--font-display, Georgia, serif);
      font-size: 26px;
      font-weight: 400;
      line-height: 1;
    }

    h2 em {
      color: var(--terracotta, #a9553c);
      font-style: italic;
      font-weight: 300;
    }

    .avatar-stage {
      padding: 18px 22px 10px;
      background:
        radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.35), transparent 55%),
        var(--water, #9db6b1);
    }

    .avatar {
      display: block;
      width: 100%;
      height: auto;
    }

    .shoulders {
      fill: #172a35;
    }

    .tunic {
      fill: url(#tunic);
      stroke: #162a34;
      stroke-width: 2;
    }

    .drape {
      fill: none;
      stroke: #d3b88f;
      stroke-width: 5;
      opacity: 0.8;
    }

    .face {
      fill: url(#skin);
      stroke: #5d3b32;
      stroke-width: 2;
    }

    .hair {
      fill: #3a2a27;
      stroke: #241b1a;
      stroke-width: 2;
    }

    .brow,
    .nose,
    .moustache,
    .mouth,
    .collar {
      fill: none;
      stroke: #4a2d29;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .brow {
      stroke-width: 6;
    }

    .nose {
      stroke-width: 3;
    }

    .moustache {
      fill: #3a2a27;
      stroke-width: 1;
    }

    .mouth {
      stroke-width: 3;
    }

    .collar {
      stroke: #d3b88f;
      stroke-width: 4;
    }

    .orbit {
      fill: #fffaf0;
      stroke: #6b4035;
      stroke-width: 2;
    }

    .pupil {
      fill: #211a1b;
      transition: cx 70ms ease-out, cy 70ms ease-out;
    }

    .glint {
      fill: #fff;
      pointer-events: none;
    }

    .hint {
      padding: 8px 16px 12px;
      font-family: var(--font-mono, monospace);
      font-size: 9px;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--ink-3, #756b61);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HannibalComponent {
  readonly LEFT_EYE = LEFT_EYE;
  readonly RIGHT_EYE = RIGHT_EYE;
  readonly ORBIT_RADIUS = ORBIT_RADIUS;
  readonly PUPIL_RADIUS = PUPIL_RADIUS;
  private readonly avatarSvg = viewChild<ElementRef<SVGSVGElement>>('avatarSvg');
  private readonly pointer = signal({ x: 0, y: 0 });

  readonly leftPupil = computed(() => this.pupilPosition(LEFT_EYE));
  readonly rightPupil = computed(() => this.pupilPosition(RIGHT_EYE));

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    this.pointer.set({ x: event.clientX, y: event.clientY });
  }

  private pupilPosition(eye: Eye): Pupil {
    const svg = this.avatarSvg()?.nativeElement;
    if (!svg) return eye;

    const bounds = svg.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return eye;

    const scaleX = 240 / bounds.width;
    const scaleY = 280 / bounds.height;
    const cursorX = (this.pointer().x - bounds.left) * scaleX;
    const cursorY = (this.pointer().y - bounds.top) * scaleY;
    const distanceX = cursorX - eye.cx;
    const distanceY = cursorY - eye.cy;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance === 0) return eye;

    // atan2/cos/sin preserve the cursor direction while the radius clamp
    // keeps the pupil strictly inside the white orbit.
    const angle = Math.atan2(distanceY, distanceX);
    const radius = Math.min(distance, MAX_PUPIL_OFFSET);

    return {
      cx: eye.cx + Math.cos(angle) * radius,
      cy: eye.cy + Math.sin(angle) * radius,
    };
  }
}
