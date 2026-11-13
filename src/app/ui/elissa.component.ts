import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { InteractionService, type Mood } from '../core/interaction.service';
import { LanguageService } from '../core/language.service';
import { MotionService } from '../core/motion.service';
import { NarratorService } from '../core/narrator.service';

type Mouth = 'smile' | 'grin' | 'open' | 'talk' | 'focus' | 'flat' | 'cheer';

const SLEEP_AFTER_MS = 14000;
let nextUid = 0;

/**
 * Élissa (Dido), the Phoenician queen who founded Carthage in 814 BC — the
 * figure on the Tunisian 10-dinar note. Her head turns, her eyes follow the
 * pointer, she blinks, reacts to clicks, typing, copying and victories, and
 * her lips move while the narration speaks.
 */
@Component({
  selector: 'app-elissa',
  template: `
    <section class="guide" aria-labelledby="guide-title">
      <header class="guide-header">
        <p class="eyebrow">{{ i18n.t('interactiveAvatar') }}</p>
        <h2 id="guide-title">
          @if (i18n.isArabic()) {
            <span lang="ar">عليسة</span> <em>ملكة قرطاج</em>
          } @else {
            Élissa <em>de Carthage</em>
          }
        </h2>
      </header>

      <button
        type="button"
        class="avatar-stage"
        data-narrate="off"
        [attr.aria-label]="i18n.t('avatarAria')"
        (click)="greet()"
      >
        @if (bubble(); as text) {
          <span class="bubble" [attr.dir]="i18n.isArabic() ? 'rtl' : 'ltr'">{{ text }}</span>
        }
        <svg
          #avatarSvg
          [class]="'avatar mood-' + mood() + (alert() ? ' is-alert' : '')"
          viewBox="0 0 240 280"
          aria-hidden="true"
        >
          <defs>
            <linearGradient [attr.id]="uid + '-skin'" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0" stop-color="#eec29a" />
              <stop offset="1" stop-color="#c58b62" />
            </linearGradient>
            <linearGradient [attr.id]="uid + '-robe'" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#7a3577" />
              <stop offset="1" stop-color="#3d1a42" />
            </linearGradient>
            <linearGradient [attr.id]="uid + '-gold'" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f6dc8a" />
              <stop offset="0.5" stop-color="#d4a23c" />
              <stop offset="1" stop-color="#9c7020" />
            </linearGradient>
            <linearGradient [attr.id]="uid + '-hair'" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#3a241a" />
              <stop offset="1" stop-color="#1c110c" />
            </linearGradient>
            <radialGradient [attr.id]="uid + '-sky'" cx="0.5" cy="0.32" r="0.75">
              <stop offset="0" stop-color="#f7e7c4" />
              <stop offset="0.55" stop-color="#d9bf8f" />
              <stop offset="1" stop-color="#7f9e9b" />
            </radialGradient>
            <clipPath [attr.id]="uid + '-eye-l'"><path d="M87 119 Q100 108 113 119 Q100 127 87 119 Z" /></clipPath>
            <clipPath [attr.id]="uid + '-eye-r'"><path d="M127 119 Q140 108 153 119 Q140 127 127 119 Z" /></clipPath>
          </defs>

          <!-- Punic stele with the sign of Tanit -->
          <path class="stele" d="M24 280 V78 Q24 18 120 18 Q216 18 216 78 V280 Z" />
          <g class="tanit-bg">
            <circle cx="120" cy="44" r="9" />
            <path d="M98 58 H142 M120 58 L100 98 H140 Z" />
          </g>
          <circle class="sun" cx="120" cy="96" r="70" />

          <g class="bust">
            <!-- hair behind -->
            <path
              class="hair-back"
              d="M64 112 C56 66 84 38 120 38 C156 38 184 66 176 112 C182 150 190 196 180 226 L150 218 C160 188 162 150 160 122 L80 122 C78 150 80 188 90 218 L60 226 C50 196 58 150 64 112 Z"
            />
            <!-- robe of Tyrian purple -->
            <path class="robe" d="M26 280 C30 230 68 204 120 204 C172 204 210 230 214 280 Z" />
            <path class="robe-fold" d="M70 236 C78 252 80 266 78 280 M170 236 C162 252 160 266 162 280" />
            <path class="robe-trim" d="M86 206 L120 244 L154 206" />
            <path class="neck" d="M104 166 L104 204 Q120 214 136 204 L136 166 Z" />
            <path class="neck-shade" d="M104 186 Q120 196 136 186 L136 176 Q120 186 104 176 Z" />
            <path class="necklace" d="M98 196 Q120 214 142 196" />
            <g class="pendant">
              <circle cx="120" cy="210" r="2.6" />
              <path d="M114.4 214 H125.6 M120 214 L115 223 H125 Z" />
            </g>
          </g>

          <g class="head">
            <g class="earring earring--l"><path d="M73 132 v6" /><circle cx="73" cy="143" r="4.2" /><circle cx="73" cy="150" r="2" /></g>
            <g class="earring earring--r"><path d="M167 132 v6" /><circle cx="167" cy="143" r="4.2" /><circle cx="167" cy="150" r="2" /></g>
            <path
              class="face"
              d="M120 60 C150 60 167 84 167 116 C167 150 147 176 120 178 C93 176 73 150 73 116 C73 84 90 60 120 60 Z"
            />

            <g class="features">
              <ellipse class="blush" cx="94" cy="142" rx="10" ry="6" />
              <ellipse class="blush" cx="146" cy="142" rx="10" ry="6" />

              <g class="eye eye--l">
                <path class="sclera" d="M87 119 Q100 108 113 119 Q100 127 87 119 Z" />
                <g [attr.clip-path]="'url(#' + uid + '-eye-l)'">
                  <g class="iris">
                    <circle cx="100" cy="118" r="5.6" class="iris-ring" />
                    <circle cx="100" cy="118" r="2.6" class="pupil" />
                    <circle cx="98.2" cy="116.2" r="1.3" class="glint" />
                  </g>
                </g>
                <path class="kohl" d="M85 118.5 Q100 106.5 114 118.5 L117 116.5" />
              </g>
              <g class="eye eye--r">
                <path class="sclera" d="M127 119 Q140 108 153 119 Q140 127 127 119 Z" />
                <g [attr.clip-path]="'url(#' + uid + '-eye-r)'">
                  <g class="iris">
                    <circle cx="140" cy="118" r="5.6" class="iris-ring" />
                    <circle cx="140" cy="118" r="2.6" class="pupil" />
                    <circle cx="138.2" cy="116.2" r="1.3" class="glint" />
                  </g>
                </g>
                <path class="kohl" d="M155 118.5 Q140 106.5 126 118.5 L123 116.5" />
              </g>

              <path class="brow brow--l" d="M86 105 Q99 97 113 103" />
              <path class="brow brow--r" d="M127 103 Q141 97 154 105" />
              <path class="nose" d="M121 122 Q118 136 114 141 Q120 145 126 141" />

              <g class="mouth">
                @switch (mouth()) {
                  @case ('grin') {
                    <path class="lips" d="M103 152 Q120 172 137 152 Q120 157 103 152 Z" />
                    <path class="teeth" d="M107 154 Q120 160 133 154 Q120 163 107 154 Z" />
                  }
                  @case ('cheer') {
                    <path class="lips" d="M101 150 Q120 180 139 150 Q120 155 101 150 Z" />
                    <path class="teeth" d="M106 152 Q120 158 134 152 Q120 160 106 152 Z" />
                    <path class="tongue" d="M112 164 Q120 159 128 164 Q120 170 112 164 Z" />
                  }
                  @case ('open') {
                    <ellipse class="lips" cx="120" cy="157" rx="6" ry="8" />
                    <ellipse class="inner" cx="120" cy="157.5" rx="3.6" ry="5.4" />
                  }
                  @case ('talk') {
                    <g class="talking">
                      <ellipse class="lips" cx="120" cy="156" rx="10" ry="6.5" />
                      <ellipse class="inner" cx="120" cy="156.5" rx="7" ry="3.8" />
                    </g>
                  }
                  @case ('focus') {
                    <path class="line" d="M110 156 Q122 158 131 153" />
                  }
                  @case ('flat') {
                    <path class="line" d="M111 157 Q120 158 129 157" />
                  }
                  @default {
                    <path class="lips" d="M106 154 Q113 150 120 152.5 Q127 150 134 154 Q120 165 106 154 Z" />
                    <path class="lip-line" d="M106 154 Q120 158 134 154" />
                  }
                }
              </g>
            </g>

            <!-- front hair, parted in the middle -->
            <path
              class="hair-front"
              d="M71 112 C70 76 92 54 120 56 C148 54 170 76 169 112 C164 92 152 80 134 78 C128 79 124 81 120 81 C116 81 112 79 106 78 C88 80 76 92 71 112 Z"
            />
            <path class="hair-shine" d="M90 70 C100 62 112 60 118 62" />
            <!-- diadem -->
            <path class="diadem" d="M80 84 Q120 66 160 84 L158 91 Q120 75 82 91 Z" />
            <circle class="gem" cx="96" cy="80" r="1.8" />
            <circle class="gem" cx="144" cy="80" r="1.8" />
            <g class="crown-sign">
              <circle cx="120" cy="69" r="5" />
              <path d="M112 76 Q120 84 128 76" />
            </g>
          </g>

          @if (mood() === 'sleepy') {
            <g class="zzz" aria-hidden="true">
              <text x="168" y="70">z</text>
              <text x="178" y="56">z</text>
              <text x="190" y="40">Z</text>
            </g>
          }
          @if (mood() === 'cheer') {
            <g class="stars" aria-hidden="true">
              <path d="M44 70 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
              <path d="M190 96 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4z" />
              <path d="M60 150 l2 4.6 4.6 2 -4.6 2 -2 4.6 -2 -4.6 -4.6 -2 4.6 -2z" />
            </g>
          }
        </svg>
      </button>

      <p class="hint">{{ i18n.t('avatarHint') }}</p>
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      --hx: 0px;
      --hy: 0px;
      --hr: 0deg;
      --fx: 0px;
      --fy: 0px;
      --ex: 0px;
      --ey: 0px;
      --ear: 0deg;
      --bx: 0px;
    }

    .guide {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--paper-soft);
    }

    .guide-header {
      padding: 12px 14px 10px;
      border-bottom: 1px solid var(--line);
    }

    h2 {
      margin-top: 4px;
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 400;
      line-height: 1;
    }

    h2 em {
      margin-inline-start: 0.25em;
      color: var(--terracotta);
      font-style: italic;
      font-weight: 300;
    }

    .avatar-stage {
      position: relative;
      display: flex;
      flex: 1;
      align-items: flex-end;
      justify-content: center;
      min-height: 0;
      width: 100%;
      padding: 10px 10px 0;
      overflow: hidden;
      background: linear-gradient(180deg, #8fa8a5 0%, #a9bcb4 60%, #d8c7a2 100%);
      cursor: pointer;
    }

    .avatar {
      display: block;
      width: auto;
      max-width: 100%;
      height: 100%;
      max-height: 340px;
    }

    .bubble {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      z-index: 2;
      display: -webkit-box;
      max-height: 5.2em;
      overflow: hidden;
      padding: 8px 10px;
      border: 1px solid var(--ink);
      background: var(--paper-soft);
      font-size: 13px;
      font-style: italic;
      line-height: 1.3;
      text-align: start;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      box-shadow: 3px 3px 0 rgba(34, 29, 23, 0.12);
      animation: bubble-in 0.35s cubic-bezier(0.2, 1.4, 0.4, 1) both;
    }

    @keyframes bubble-in {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.92);
      }
    }

    /* ---- drawing ---- */
    .stele {
      fill: var(--el-sky);
      stroke: rgba(34, 29, 23, 0.25);
      stroke-width: 1.2;
    }

    .tanit-bg {
      fill: none;
      stroke: rgba(173, 76, 42, 0.28);
      stroke-width: 3;
      stroke-linejoin: round;
    }

    .sun {
      fill: rgba(255, 245, 220, 0.35);
    }

    .bust,
    .head,
    .features,
    .iris,
    .eye,
    .earring,
    .hair-back {
      transform-box: view-box;
    }

    .bust {
      transform: translateX(var(--bx));
      transition: transform 0.2s linear;
    }

    .head {
      transform-origin: 120px 196px;
      transform: translate(var(--hx), var(--hy)) rotate(var(--hr));
    }

    .features {
      transform: translate(var(--fx), var(--fy));
    }

    .iris {
      transform: translate(var(--ex), var(--ey));
    }

    .hair-back {
      fill: var(--el-hair);
    }

    .robe {
      fill: var(--el-robe);
    }

    .robe-fold {
      fill: none;
      stroke: rgba(0, 0, 0, 0.25);
      stroke-width: 2;
    }

    .robe-trim {
      fill: none;
      stroke: var(--el-gold);
      stroke-width: 5;
      stroke-linejoin: round;
    }

    .neck {
      fill: var(--el-skin);
    }

    .neck-shade {
      fill: rgba(120, 60, 30, 0.18);
    }

    .necklace {
      fill: none;
      stroke: var(--el-gold);
      stroke-width: 2.4;
    }

    .pendant {
      fill: #d4a23c;
      stroke: #8a6418;
      stroke-width: 1.2;
      stroke-linejoin: round;
    }

    .face {
      fill: var(--el-skin);
      stroke: #8b5a3c;
      stroke-width: 1.4;
    }

    .blush {
      fill: #e0806a;
      opacity: 0.18;
      transition: opacity 0.4s;
    }

    .mood-happy .blush,
    .mood-cheer .blush {
      opacity: 0.5;
    }

    .eye {
      transform-origin: center;
      transform-box: fill-box;
      transition: transform 0.12s ease;
    }

    .sclera {
      fill: #fffaf0;
    }

    .iris-ring {
      fill: #5a3a1e;
      stroke: #2a1a0e;
      stroke-width: 0.8;
    }

    .pupil {
      fill: #120b06;
    }

    .glint {
      fill: #fff;
    }

    .kohl {
      fill: none;
      stroke: #1a100a;
      stroke-width: 2.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .brow {
      fill: none;
      stroke: #2a1a12;
      stroke-width: 3.4;
      stroke-linecap: round;
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
    }

    .nose {
      fill: none;
      stroke: #94603f;
      stroke-width: 1.8;
      stroke-linecap: round;
    }

    .lips {
      fill: #b44c45;
      stroke: #7e2f2b;
      stroke-width: 1;
    }

    .lip-line,
    .line {
      fill: none;
      stroke: #7e2f2b;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .teeth {
      fill: #fffaf2;
    }

    .inner {
      fill: #4a1612;
    }

    .tongue {
      fill: #d8706a;
    }

    .talking {
      transform-box: fill-box;
      transform-origin: center;
      animation: talk 0.19s ease-in-out infinite alternate;
    }

    @keyframes talk {
      from {
        transform: scale(0.85, 0.32);
      }
      to {
        transform: scale(1, 1.05);
      }
    }

    .hair-front {
      fill: var(--el-hair);
      stroke: #120a06;
      stroke-width: 1;
    }

    .hair-shine {
      fill: none;
      stroke: rgba(255, 220, 180, 0.25);
      stroke-width: 3;
      stroke-linecap: round;
    }

    .diadem {
      fill: var(--el-gold);
      stroke: #8a6418;
      stroke-width: 0.8;
    }

    .gem {
      fill: #2c6e8f;
      stroke: #f6dc8a;
      stroke-width: 0.8;
    }

    .crown-sign {
      fill: var(--el-gold);
      stroke: #8a6418;
      stroke-width: 1.4;
    }

    .crown-sign path {
      fill: none;
      stroke: var(--el-gold);
      stroke-width: 2.6;
      stroke-linecap: round;
    }

    .earring {
      fill: var(--el-gold);
      stroke: #8a6418;
      stroke-width: 0.8;
      transition: transform 0.35s cubic-bezier(0.3, 1.8, 0.5, 1);
    }

    .earring path {
      fill: none;
      stroke: #d4a23c;
      stroke-width: 1.4;
    }

    .earring--l {
      transform-origin: 73px 132px;
      transform: rotate(var(--ear));
    }

    .earring--r {
      transform-origin: 167px 132px;
      transform: rotate(var(--ear));
    }

    /* ---- moods ---- */
    .mood-surprised .brow,
    .mood-curious .brow {
      transform: translateY(-5px);
    }

    .mood-surprised .eye,
    .is-alert .eye {
      transform: scale(1.12);
    }

    .mood-focused .brow--l {
      transform: translateY(2px) rotate(4deg);
    }

    .mood-focused .brow--r {
      transform: translateY(2px) rotate(-4deg);
    }

    .mood-focused .eye {
      transform: scaleY(0.82);
    }

    .mood-happy .eye {
      transform: scaleY(0.78);
    }

    .mood-cheer .eye {
      transform: scaleY(0.22);
    }

    .mood-cheer .brow {
      transform: translateY(-6px);
    }

    .mood-sleepy .eye {
      transform: scaleY(0.3);
    }

    :host(.blink) .eye {
      transform: scaleY(0.06) !important;
      transition-duration: 0.06s;
    }

    .zzz text {
      font-family: var(--font-display);
      font-style: italic;
      fill: var(--indigo);
      animation: zzz 2.4s ease-in-out infinite;
    }

    .zzz text:nth-child(1) {
      font-size: 12px;
    }

    .zzz text:nth-child(2) {
      font-size: 16px;
      animation-delay: 0.5s;
    }

    .zzz text:nth-child(3) {
      font-size: 20px;
      animation-delay: 1s;
    }

    @keyframes zzz {
      0%,
      100% {
        opacity: 0;
        transform: translateY(6px);
      }
      50% {
        opacity: 0.85;
        transform: translateY(0);
      }
    }

    .stars path {
      fill: #f6dc8a;
      stroke: #9c7020;
      stroke-width: 0.8;
      transform-box: fill-box;
      transform-origin: center;
      animation: twinkle 0.8s ease-in-out infinite alternate;
    }

    .stars path:nth-child(2) {
      animation-delay: 0.3s;
    }

    .stars path:nth-child(3) {
      animation-delay: 0.55s;
    }

    @keyframes twinkle {
      from {
        transform: scale(0.5) rotate(0deg);
        opacity: 0.4;
      }
      to {
        transform: scale(1.25) rotate(45deg);
        opacity: 1;
      }
    }

    .mood-cheer.avatar {
      animation: hop 0.5s ease-in-out 4 alternate;
    }

    @keyframes hop {
      to {
        transform: translateY(-8px);
      }
    }

:host(.float-guide) .guide-header,
    :host(.float-guide) .hint {
      display: none;
    }

    :host(.float-guide) .guide {
      border-radius: 14px;
      box-shadow: 0 8px 20px rgba(34, 29, 23, 0.25);
    }

    :host(.float-guide) .avatar-stage {
      padding: 4px 4px 0;
    }

    :host(.float-guide) .bubble {
      top: auto;
      bottom: calc(100% + 8px);
      left: 0;
      right: auto;
      width: min(260px, 70vw);
    }

    :host(.float-guide) .guide {
      overflow: visible;
    }

    .hint {
      padding: 7px 14px 10px;
      border-top: 1px solid var(--line);
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--ink-3);
    }

    @media (prefers-reduced-motion: reduce) {
      .talking {
        animation: none;
      }
    }
  `,
  host: {
    '[style.--el-skin]': "'url(#' + uid + '-skin)'",
    '[style.--el-robe]': "'url(#' + uid + '-robe)'",
    '[style.--el-gold]': "'url(#' + uid + '-gold)'",
    '[style.--el-hair]': "'url(#' + uid + '-hair)'",
    '[style.--el-sky]': "'url(#' + uid + '-sky)'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElissaComponent implements OnDestroy {
  /** Unique prefix so several avatars on one page don't share SVG gradient ids. */
  readonly uid = `elissa-${(nextUid += 1)}`;
  readonly i18n = inject(LanguageService);
  private readonly interaction = inject(InteractionService);
  private readonly narrator = inject(NarratorService);
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly avatarSvg = viewChild<ElementRef<SVGSVGElement>>('avatarSvg');

  private readonly sleeping = signal(false);
  readonly alert = signal(false);
  readonly mood = computed<Mood>(() => {
    const mood = this.interaction.mood();
    if (mood !== 'idle') return mood;
    return this.sleeping() ? 'sleepy' : 'idle';
  });
  readonly mouth = computed<Mouth>(() => {
    const mood = this.mood();
    if (mood === 'cheer') return 'cheer';
    if (this.narrator.speaking()) return 'talk';
    switch (mood) {
      case 'happy':
        return 'grin';
      case 'surprised':
        return 'open';
      case 'curious':
        return 'smile';
      case 'focused':
        return 'focus';
      case 'sleepy':
        return 'flat';
      default:
        return 'smile';
    }
  });
  readonly bubble = computed(() => {
    if (!this.narrator.speaking()) return null;
    const text = this.narrator.caption();
    return text.length > 150 ? `${text.slice(0, 148)}…` : text;
  });

  private frame = 0;
  private blinkTimer: number | null = null;
  private alertTimer: number | null = null;
  private readonly current = { hx: 0, hy: 0, hr: 0, fx: 0, fy: 0, ex: 0, ey: 0, ear: 0 };
  private lastHr = 0;

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        this.frame = requestAnimationFrame(this.tick);
        this.document.addEventListener('pointermove', this.onAnyMove, { passive: true });
        this.document.addEventListener('keydown', this.onAnyMove);
        this.scheduleBlink();
      });
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    if (this.blinkTimer !== null) window.clearTimeout(this.blinkTimer);
    if (this.alertTimer !== null) window.clearTimeout(this.alertTimer);
    this.document.removeEventListener('pointermove', this.onAnyMove);
    this.document.removeEventListener('keydown', this.onAnyMove);
  }

  greet(): void {
    this.interaction.react('happy', 2600);
    this.narrator.say(this.i18n.t('meetGuide'), { force: true, priority: true });
  }

  private readonly onAnyMove = (event: Event): void => {
    if (event.type === 'keydown') this.interaction.pointer.lastMove = performance.now();
    if (this.sleeping()) this.zone.run(() => this.sleeping.set(false));
    if (this.interaction.pointer.speed > 38 && !this.alert()) {
      this.zone.run(() => this.alert.set(true));
      if (this.alertTimer !== null) window.clearTimeout(this.alertTimer);
      this.alertTimer = window.setTimeout(() => this.zone.run(() => this.alert.set(false)), 450);
    }
  };

  private readonly tick = (time: number): void => {
    this.frame = requestAnimationFrame(this.tick);
    const svg = this.avatarSvg()?.nativeElement;
    if (!svg) return;
    const p = this.interaction.pointer;

    if (p.lastMove && time - p.lastMove > SLEEP_AFTER_MS && !this.sleeping() && !this.narrator.speaking()) {
      this.zone.run(() => this.sleeping.set(true));
    }

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.42;
    const range = Math.max(380, window.innerWidth * 0.35);
    const nx = clamp((p.x - cx) / range, -1, 1);
    const ny = clamp((p.y - cy) / range, -1, 1);
    const reduce = this.motion.reduced() ? 0.3 : 1;
    const asleep = this.sleeping() ? 0.15 : 1;
    const breathing = Math.sin(time / 1100) * 0.6;

    const target = {
      hx: nx * 6 * reduce * asleep,
      hy: (ny * 4 + breathing) * reduce,
      hr: (nx * 6 + (this.sleeping() ? 7 : 0)) * reduce,
      fx: nx * 4.5 * reduce * asleep,
      fy: ny * 3 * reduce * asleep,
      ex: nx * 4,
      ey: ny * 2.6,
      ear: 0,
    };
    const c = this.current;
    const k = 0.14;
    c.hx += (target.hx - c.hx) * k;
    c.hy += (target.hy - c.hy) * k;
    c.hr += (target.hr - c.hr) * k;
    c.fx += (target.fx - c.fx) * k;
    c.fy += (target.fy - c.fy) * k;
    c.ex += (target.ex - c.ex) * 0.3;
    c.ey += (target.ey - c.ey) * 0.3;
    // earrings swing opposite to the head's angular velocity
    const swing = (c.hr - this.lastHr) * -9;
    this.lastHr = c.hr;
    c.ear += (clamp(swing, -18, 18) - c.ear) * 0.2;

    const style = this.host.nativeElement.style;
    style.setProperty('--hx', `${c.hx.toFixed(2)}px`);
    style.setProperty('--hy', `${c.hy.toFixed(2)}px`);
    style.setProperty('--hr', `${c.hr.toFixed(2)}deg`);
    style.setProperty('--fx', `${c.fx.toFixed(2)}px`);
    style.setProperty('--fy', `${c.fy.toFixed(2)}px`);
    style.setProperty('--ex', `${c.ex.toFixed(2)}px`);
    style.setProperty('--ey', `${c.ey.toFixed(2)}px`);
    style.setProperty('--ear', `${c.ear.toFixed(2)}deg`);
    style.setProperty('--bx', `${(c.hx * 0.25).toFixed(2)}px`);
  };

  private scheduleBlink(): void {
    const delay = 2200 + Math.random() * 3800;
    this.blinkTimer = window.setTimeout(() => {
      const host = this.host.nativeElement;
      if (!this.sleeping()) {
        host.classList.add('blink');
        window.setTimeout(() => host.classList.remove('blink'), 130);
        // occasional double blink
        if (Math.random() < 0.2) {
          window.setTimeout(() => host.classList.add('blink'), 260);
          window.setTimeout(() => host.classList.remove('blink'), 390);
        }
      }
      this.scheduleBlink();
    }, delay);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
