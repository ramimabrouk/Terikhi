import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ApiService, type PuzzleMode, type PuzzleScore } from '../core/api.service';
import { GeometryService, type PuzzleShape } from '../core/geometry.service';
import { InteractionService } from '../core/interaction.service';
import { LanguageService } from '../core/language.service';
import { NarratorService } from '../core/narrator.service';

interface Piece {
  id: string;
  name: string;
  nameAr: string;
  region: 'Nord' | 'Centre' | 'Sud';
  d: string;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  placed: boolean;
  order: number;
}

interface Drag {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  originDx: number;
  originDy: number;
  moved: boolean;
}

const BOARD_W = 1000;
const BOARD_H = 700;
const MAP_EXTENT: [[number, number], [number, number]] = [
  [372, 22],
  [628, 678],
];
const BANDS: [number, number][] = [
  [16, 352],
  [648, 984],
];

@Component({
  selector: 'app-map-puzzle',
  templateUrl: './map-puzzle.component.html',
  styleUrl: './map-puzzle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPuzzleComponent implements OnDestroy {
  readonly i18n = inject(LanguageService);
  private readonly geometry = inject(GeometryService);
  private readonly interaction = inject(InteractionService);
  private readonly narrator = inject(NarratorService);
  private readonly api = inject(ApiService);
  private readonly document = inject(DOCUMENT);
  private readonly boardRef = viewChild<ElementRef<SVGSVGElement>>('board');

  readonly closed = output<void>();

  readonly width = BOARD_W;
  readonly height = BOARD_H;
  readonly mode = signal<PuzzleMode>('easy');
  readonly targets = signal<readonly PuzzleShape[]>([]);
  readonly pieces = signal<readonly Piece[]>([]);
  readonly activeId = signal<string | null>(null);
  readonly hintId = signal<string | null>(null);
  readonly lastPlacedId = signal<string | null>(null);
  readonly moves = signal(0);
  readonly elapsed = signal(0);
  readonly done = signal(false);
  readonly saved = signal(false);
  readonly playerName = signal(this.readName());
  readonly scores = signal<PuzzleScore[]>([]);
  readonly online = this.api.online;

  readonly placedCount = computed(() => this.pieces().filter((piece) => piece.placed).length);
  readonly total = computed(() => this.pieces().length);
  readonly progress = computed(() => (this.total() ? this.placedCount() / this.total() : 0));
  readonly time = computed(() => formatTime(this.elapsed()));
  /** Placed pieces first, the dragged piece last (on top). */
  readonly renderOrder = computed(() => {
    const active = this.activeId();
    return [...this.pieces()].sort((a, b) => {
      if (a.id === active) return 1;
      if (b.id === active) return -1;
      if (a.placed !== b.placed) return a.placed ? -1 : 1;
      return a.order - b.order;
    });
  });
  readonly hintTarget = computed(() => {
    const id = this.hintId();
    return id ? (this.targets().find((target) => target.id === id) ?? null) : null;
  });

  private drag: Drag | null = null;
  private startedAt: number | null = null;
  private timer: number | null = null;
  private hintTimer: number | null = null;

  constructor() {
    void this.init();
    this.document.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy(): void {
    this.detachWindow();
    this.stopTimer();
    if (this.hintTimer !== null) window.clearTimeout(this.hintTimer);
    this.document.removeEventListener('keydown', this.onKey);
  }

  private async init(): Promise<void> {
    await this.geometry.load();
    this.targets.set(this.geometry.projectInto(MAP_EXTENT));
    this.shuffle();
    this.narrator.say(`${this.i18n.t('puzzleTitle')}. ${this.i18n.t('puzzleIntro')}`, {
      priority: true,
    });
  }

  setMode(mode: PuzzleMode): void {
    if (this.mode() === mode) return;
    this.mode.set(mode);
    this.shuffle();
  }

  shuffle(): void {
    const targets = this.targets();
    const boxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const ordered = [...targets].sort((a, b) => b.area - a.area);
    const pieces: Piece[] = ordered.map((target, index) => {
      const w = target.bounds[1][0] - target.bounds[0][0];
      const h = target.bounds[1][1] - target.bounds[0][1];
      const band = BANDS[index % 2];
      let best = { x: 0, y: 0, overlap: Number.POSITIVE_INFINITY };
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const minX = band[0] + w / 2;
        const maxX = band[1] - w / 2;
        const x = maxX > minX ? minX + Math.random() * (maxX - minX) : (band[0] + band[1]) / 2;
        const y = h / 2 + 12 + Math.random() * Math.max(0, BOARD_H - h - 24);
        const box = { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
        const overlap = boxes.reduce((sum, other) => sum + overlapArea(box, other), 0);
        if (overlap < best.overlap) best = { x, y, overlap };
        if (overlap === 0) break;
      }
      boxes.push({ x0: best.x - w / 2, y0: best.y - h / 2, x1: best.x + w / 2, y1: best.y + h / 2 });
      const boxCx = (target.bounds[0][0] + target.bounds[1][0]) / 2;
      const boxCy = (target.bounds[0][1] + target.bounds[1][1]) / 2;
      return {
        id: target.id,
        name: target.city.name,
        nameAr: target.city.nameAr,
        region: target.city.region,
        d: target.d,
        cx: target.centroid[0],
        cy: target.centroid[1],
        dx: best.x - boxCx,
        dy: best.y - boxCy,
        placed: false,
        order: index,
      };
    });
    this.pieces.set(pieces);
    this.moves.set(0);
    this.elapsed.set(0);
    this.done.set(false);
    this.saved.set(false);
    this.lastPlacedId.set(null);
    this.startedAt = null;
    this.stopTimer();
    void this.loadScores();
  }

  hint(): void {
    const free = this.pieces().filter((piece) => !piece.placed);
    if (free.length === 0) return;
    const piece = free[Math.floor(Math.random() * free.length)];
    this.hintId.set(piece.id);
    this.elapsed.update((value) => value + 5000);
    if (this.startedAt !== null) this.startedAt -= 5000;
    this.narrator.say(this.i18n.isArabic() ? piece.nameAr : piece.name, { priority: true });
    if (this.hintTimer !== null) window.clearTimeout(this.hintTimer);
    this.hintTimer = window.setTimeout(() => this.hintId.set(null), 2200);
  }

  close(): void {
    this.closed.emit();
  }

  onPointerDown(event: PointerEvent, piece: Piece): void {
    if (piece.placed || this.done()) return;
    event.preventDefault();
    const point = this.toBoard(event);
    (event.currentTarget as Element).setPointerCapture?.(event.pointerId);
    this.drag = {
      id: piece.id,
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      originDx: piece.dx,
      originDy: piece.dy,
      moved: false,
    };
    this.activeId.set(piece.id);
    // Listen on window: the dragged piece is moved to the top of the SVG,
    // which can drop pointer capture, so element-level events are unreliable.
    window.addEventListener('pointermove', this.windowMove);
    window.addEventListener('pointerup', this.windowUp);
    window.addEventListener('pointercancel', this.windowUp);
    this.interaction.react('focused', 2000);
    if (this.startedAt === null) this.startTimer();
  }

  onPointerMove(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = this.toBoard(event);
    const dx = drag.originDx + point.x - drag.startX;
    const dy = drag.originDy + point.y - drag.startY;
    if (!drag.moved && Math.hypot(point.x - drag.startX, point.y - drag.startY) > 3) drag.moved = true;
    this.pieces.update((pieces) =>
      pieces.map((piece) => (piece.id === drag.id ? { ...piece, dx, dy } : piece)),
    );
  }

  private readonly windowMove = (event: PointerEvent): void => this.onPointerMove(event);
  private readonly windowUp = (event: PointerEvent): void => this.onPointerUp(event);

  private detachWindow(): void {
    window.removeEventListener('pointermove', this.windowMove);
    window.removeEventListener('pointerup', this.windowUp);
    window.removeEventListener('pointercancel', this.windowUp);
  }

  onPointerUp(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    this.drag = null;
    this.detachWindow();
    this.activeId.set(null);
    if (!drag.moved) return;
    this.moves.update((value) => value + 1);
    const snap = this.mode() === 'easy' ? 22 : 14;
    const piece = this.pieces().find((item) => item.id === drag.id);
    if (!piece) return;
    if (Math.hypot(piece.dx, piece.dy) <= snap) {
      this.pieces.update((pieces) =>
        pieces.map((item) => (item.id === piece.id ? { ...item, dx: 0, dy: 0, placed: true } : item)),
      );
      this.lastPlacedId.set(piece.id);
      if (this.hintId() === piece.id) this.hintId.set(null);
      this.interaction.react('happy', 1100);
      if (this.placedCount() === this.total()) {
        this.finish();
      } else {
        this.narrator.say(this.i18n.isArabic() ? piece.nameAr : piece.name);
      }
    }
  }

  async saveScore(): Promise<void> {
    if (this.saved()) return;
    const name = this.playerName().trim().slice(0, 24) || 'Anonyme';
    try {
      window.localStorage.setItem('tunisia-explorer:player', name);
    } catch {
      /* ignore */
    }
    await this.api.saveScore({
      name,
      mode: this.mode(),
      timeMs: this.elapsed(),
      moves: this.moves(),
    });
    this.saved.set(true);
    this.narrator.say(this.i18n.t('scoreSaved'), { priority: true });
    await this.loadScores();
  }

  setName(event: Event): void {
    this.playerName.set((event.target as HTMLInputElement).value);
  }

  formatTime = formatTime;

  pieceTransform(piece: Piece): string {
    return `translate(${piece.dx.toFixed(1)} ${piece.dy.toFixed(1)})`;
  }

  waveDelay(piece: Piece): number {
    // celebration wave travels from north to south
    return Math.round(((piece.cy - MAP_EXTENT[0][1]) / (MAP_EXTENT[1][1] - MAP_EXTENT[0][1])) * 900);
  }

  private finish(): void {
    this.stopTimer();
    if (this.startedAt !== null) this.elapsed.set(performance.now() - this.startedAt);
    this.done.set(true);
    this.interaction.party();
    const board = this.boardRef()?.nativeElement.getBoundingClientRect();
    if (board) {
      this.interaction.requestDive(board.left + board.width / 2, board.top + board.height / 2, 'region');
    }
    this.narrator.say(`${this.i18n.t('bravo')} ${this.i18n.t('puzzleDone')} ${this.i18n.t('time')} : ${this.time()}.`, {
      priority: true,
    });
  }

  private async loadScores(): Promise<void> {
    this.scores.set(await this.api.topScores(this.mode()));
  }

  private startTimer(): void {
    this.startedAt = performance.now() - this.elapsed();
    this.stopTimer();
    this.timer = window.setInterval(() => {
      if (this.startedAt !== null) this.elapsed.set(performance.now() - this.startedAt);
    }, 250);
  }

  private stopTimer(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  private toBoard(event: PointerEvent): { x: number; y: number } {
    const svg = this.boardRef()?.nativeElement;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return { x: event.clientX, y: event.clientY };
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  }

  private readName(): string {
    try {
      return window.localStorage.getItem('tunisia-explorer:player') ?? '';
    } catch {
      return '';
    }
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  };
}

function overlapArea(
  a: { x0: number; y0: number; x1: number; y1: number },
  b: { x0: number; y0: number; x1: number; y1: number },
): number {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
  const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  return w > 0 && h > 0 ? w * h : 0;
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
