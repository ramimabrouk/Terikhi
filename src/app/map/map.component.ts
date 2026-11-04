import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import type { GovernorateShape } from '../core/geometry.service';
import { GeometryService } from '../core/geometry.service';
import { MotionService } from '../core/motion.service';
import type { Region } from '../data/cities.data';

interface TooltipState {
  id: string;
  x: number;
  y: number;
}

interface MapLabel {
  id: string;
  x: number;
  y: number;
  name: string;
  fallback: boolean;
}

interface MapCluster {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  anchor: 'start' | 'end';
  label: string;
  leader: string;
}

interface ZoomTarget {
  x: number;
  y: number;
  scale: number;
}

@Component({
  selector: 'app-tunisia-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TunisiaMapComponent implements OnDestroy {
  readonly geometry = inject(GeometryService);
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svg');
  private readonly worldRef = viewChild<ElementRef<SVGGElement>>('world');

  readonly selectedId = input<string | null>(null);
  readonly regionFilter = input<Region | null>(null);
  readonly reveal = input(true);
  readonly compact = input(false);

  readonly citySelected = output<string>();
  readonly cleared = output<void>();

  readonly shapes = this.geometry.shapes;
  readonly status = this.geometry.status;
  readonly viewBox = this.geometry.viewBox;
  readonly viewBoxRect = this.geometry.viewBoxRect;
  readonly shapeByCityId = this.geometry.shapeByCityId;
  readonly viewportReady = this.geometry.viewportReady;

  readonly hoveredId = signal<string | null>(null);
  readonly tip = signal<TooltipState | null>(null);

  readonly tipShape = computed<GovernorateShape | null>(() => {
    const tip = this.tip();
    return tip ? (this.shapeByCityId().get(tip.id) ?? null) : null;
  });

  private readonly labelLayout = signal<MapLabel[]>([]);
  private readonly blockedLabels = signal<ReadonlySet<string>>(new Set());
  readonly visibleLabels = computed(() =>
    this.labelLayout().filter((label) => !this.blockedLabels().has(label.id)),
  );

  readonly capital = computed<GovernorateShape | null>(
    () => this.shapeByCityId().get('tunis') ?? null,
  );

  readonly clusters = computed<MapCluster[]>(() => {
    const width = this.viewBoxRect().width;
    const height = this.viewBoxRect().height;
    const items: MapCluster[] = [];
    const add = (id: string, label: string, targetId: string, offsetY: number): void => {
      const shape = this.shapeByCityId().get(targetId);
      if (!shape) return;
      const [targetX, targetY] = shape.centroid;
      const x = width - 44;
      const y = Math.max(18, Math.min(height - 18, targetY + offsetY));
      items.push({
        id,
        x,
        y,
        targetX,
        targetY,
        anchor: 'end',
        label,
        leader: `M${targetX},${targetY} L${x + 4},${y + 4}`,
      });
    };
    add('grand-tunis', 'GRAND TUNIS', 'tunis', -18);
    add('cap-bon', 'CAP BON', 'nabeul', 8);
    add('sahel', 'SAHEL', 'sousse', 14);
    return items;
  });

  readonly selectedShape = computed<GovernorateShape | null>(() => {
    const id = this.selectedId();
    return id ? (this.shapeByCityId().get(id) ?? null) : null;
  });

  readonly focusedId = signal<string | null>(null);
  readonly focusShape = computed<GovernorateShape | null>(() => {
    const id = this.focusedId();
    return id ? (this.shapeByCityId().get(id) ?? null) : null;
  });

  private readonly view: ZoomTarget = { x: 0, y: 0, scale: 1 };
  private appliedKey: string | undefined = undefined;
  private revealed = false;
  private revealCtx: gsap.Context | null = null;
  private zoomTween: gsap.core.Tween | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeTimer: number | null = null;
  private labelSignature = '';

  constructor() {
    afterNextRender(() => this.observeViewport());
    afterRenderEffect(() => {
      this.drawReveal();
    });
    afterRenderEffect(() => {
      this.applySelection();
    });
    afterRenderEffect(() => {
      this.layoutLabels();
    });
    afterRenderEffect(() => {
      this.validateRenderedLabels();
    });
    afterRenderEffect(() => {
      if (this.selectedId()) {
        this.focusedId.set(null);
        this.clearTip();
      }
    });
  }

  ngOnDestroy(): void {
    this.revealCtx?.revert();
    this.zoomTween?.kill();
    gsap.killTweensOf(this.view);
    this.resizeObserver?.disconnect();
    if (this.resizeTimer !== null) window.clearTimeout(this.resizeTimer);
  }

  isMuted(shape: GovernorateShape): boolean {
    const selected = this.selectedId();
    if (selected) return selected !== shape.id;
    const filter = this.regionFilter();
    return filter !== null && shape.city.region !== filter;
  }

  ariaLabel(shape: GovernorateShape): string {
    const capital = shape.city.isCapital ? ' Capitale de la Tunisie.' : '';
    return `${shape.city.name}, gouvernorat de la région ${shape.city.region}.${capital} Ouvrir la fiche.`;
  }

  onSelect(shape: GovernorateShape): void {
    this.clearTip();
    this.focusedId.set(null);
    this.citySelected.emit(shape.id);
  }

  onPathKey(event: KeyboardEvent, shape: GovernorateShape): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.onSelect(shape);
  }

  showTip(shape: GovernorateShape, event: PointerEvent): void {
    if (this.selectedId() || event.pointerType === 'touch') return;
    this.hoveredId.set(shape.id);
    this.placeTip(shape.id, event.clientX, event.clientY);
  }

  moveTip(shape: GovernorateShape, event: PointerEvent): void {
    if (this.selectedId() || this.tip()?.id !== shape.id) return;
    this.placeTip(shape.id, event.clientX, event.clientY);
  }

  showFocusTip(shape: GovernorateShape, event: FocusEvent): void {
    const target = event.target;
    if (!(target instanceof SVGPathElement)) return;
    this.focusedId.set(target.matches(':focus-visible') ? shape.id : null);
    requestAnimationFrame(() => {
      if (!target.isConnected || this.selectedId()) return;
      this.focusedId.set(target.matches(':focus-visible') ? shape.id : null);
    });
  }

  clearTip(): void {
    this.hoveredId.set(null);
    this.tip.set(null);
  }

  onBlur(): void {
    this.clearTip();
    this.focusedId.set(null);
  }

  onBackdrop(): void {
    if (this.selectedId()) {
      this.cleared.emit();
    }
  }

  retry(): void {
    void this.geometry.load();
  }

  private placeTip(id: string, clientX: number, clientY: number): void {
    const hostRect = this.host.nativeElement.getBoundingClientRect();
    this.tip.set({
      id,
      x: clamp(clientX - hostRect.left + 18, 12, Math.max(12, hostRect.width - 220)),
      y: clamp(clientY - hostRect.top + 16, 12, Math.max(12, hostRect.height - 120)),
    });
  }

  private drawReveal(): void {
    const shapes = this.shapes();
    const svg = this.svgRef()?.nativeElement;
    const world = this.worldRef()?.nativeElement;
    if (
      !svg ||
      !world ||
      shapes.length === 0 ||
      !this.viewportReady() ||
      !this.reveal() ||
      this.revealed
    ) {
      return;
    }

    const paths = Array.from(world.querySelectorAll<SVGPathElement>('path.gov'));
    if (paths.length === 0) return;
    this.revealed = true;
    this.revealCtx?.revert();

    if (this.motion.reduced()) {
      svg.classList.add('is-revealed');
      gsap.set(paths, { clearProps: 'opacity,strokeDasharray,strokeDashoffset' });
      return;
    }

    gsap.set(paths, { opacity: 0 });
    svg.classList.add('is-revealed');

    this.revealCtx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(paths, { clearProps: 'opacity,strokeDasharray,strokeDashoffset' });
        },
      });
      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length });
        const offset = index * 0.028;
        timeline.to(path, { strokeDashoffset: 0, duration: 1.05, ease: 'power2.inOut' }, offset);
        timeline.to(path, { opacity: 1, duration: 0.55, ease: 'sine.out' }, offset);
      });
    }, this.host.nativeElement);
  }

  private applySelection(): void {
    const shapes = this.shapes();
    const id = this.selectedId();
    const reveal = this.reveal();
    const world = this.worldRef()?.nativeElement;
    const v = this.viewBoxRect();
    if (!world || !reveal || !this.viewportReady() || shapes.length === 0) return;

    const layout = `${Math.round(v.width)}x${Math.round(v.height)}`;
    const key = `${id ?? 'none'}|${layout}`;
    if (this.appliedKey === key) return;
    const previousKey = this.appliedKey;
    this.appliedKey = key;
    const first = previousKey === undefined;
    const layoutChanged =
      previousKey !== undefined && previousKey.split('|')[1] !== key.split('|')[1];
    const shape = id ? this.shapeByCityId().get(id) : null;
    const target = shape ? this.zoomTarget(shape) : { x: 0, y: 0, scale: 1 };

    gsap.killTweensOf(this.view);
    this.zoomTween?.kill();

    if (first || layoutChanged || this.motion.reduced()) {
      this.view.x = target.x;
      this.view.y = target.y;
      this.view.scale = target.scale;
      this.applyTransform(world);
      return;
    }

    this.zoomTween = gsap.to(this.view, {
      x: target.x,
      y: target.y,
      scale: target.scale,
      duration: 0.95,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => this.applyTransform(world),
    });
  }

  private zoomTarget(shape: GovernorateShape): ZoomTarget {
    const v = this.viewBoxRect();
    const width = Math.max(shape.bounds[1][0] - shape.bounds[0][0], 1);
    const height = Math.max(shape.bounds[1][1] - shape.bounds[0][1], 1);
    const centerX = (shape.bounds[0][0] + shape.bounds[1][0]) / 2;
    const centerY = (shape.bounds[0][1] + shape.bounds[1][1]) / 2;
    const rawScale = Math.min(v.width / (width * 1.8), v.height / (height * 1.8));
    const scale = clamp(rawScale, 1.15, 6);
    return {
      x: v.x + v.width / 2 - scale * centerX,
      y: v.y + v.height / 2 - scale * centerY,
      scale,
    };
  }

  private applyTransform(world: SVGGElement): void {
    world.setAttribute(
      'transform',
      `translate(${this.view.x.toFixed(2)} ${this.view.y.toFixed(2)}) scale(${this.view.scale.toFixed(4)})`,
    );
  }

  private layoutLabels(): void {
    const shapes = this.shapes();
    const svg = this.svgRef()?.nativeElement;
    if (!svg || !this.viewportReady() || shapes.length === 0) {
      if (this.labelSignature !== '') {
        this.labelSignature = '';
        this.labelLayout.set([]);
        this.blockedLabels.set(new Set());
      }
      return;
    }

    const placed: { left: number; right: number; top: number; bottom: number }[] = [];
    const labels: MapLabel[] = [];
    const candidates = [...shapes]
      .filter((shape) => shape.labelAnchors.length > 0)
      .sort((a, b) => b.area - a.area);
    const boxes = this.measureLabelBoxes(svg, candidates);

    for (const shape of candidates) {
      const path = svg.querySelector<SVGPathElement>(`path.gov[data-city="${shape.id}"]`);
      const box = boxes.get(shape.id);
      if (!path || !box) continue;

      for (const anchor of shape.labelAnchors) {
        const left = anchor.x + box.x;
        const right = left + box.width;
        const top = anchor.y + box.y;
        const bottom = top + box.height;

        if (
          left < 4 ||
          right > this.viewBoxRect().width - 4 ||
          top < 4 ||
          bottom > this.viewBoxRect().height - 4
        ) {
          continue;
        }

        const samples: [number, number][] = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [left + box.width / 2, top],
          [left + box.width / 2, bottom],
          [left, top + box.height / 2],
          [right, top + box.height / 2],
          [left + box.width / 2, top + box.height / 2],
        ];

        let inside = true;
        for (const sample of samples) {
          if (!path.isPointInFill(new DOMPoint(sample[0], sample[1]))) {
            inside = false;
            break;
          }
        }
        if (!inside) continue;

        const collision = {
          left: left - 4,
          right: right + 4,
          top: top - 4,
          bottom: bottom + 4,
        };
        if (placed.some((other) => overlaps(other, collision))) continue;
        placed.push(collision);
        labels.push({
          id: shape.id,
          x: anchor.x,
          y: anchor.y,
          name: shape.city.name.toUpperCase(),
          fallback: false,
        });
        break;
      }
    }

    const placedIds = new Set(labels.map((label) => label.id));
    for (const shape of candidates) {
      if (placedIds.has(shape.id)) continue;
      labels.push({
        id: shape.id,
        x: shape.centroid[0],
        y: shape.centroid[1],
        name: shape.city.name.toUpperCase(),
        fallback: true,
      });
    }

    const signature = labels
      .map(
        (label) =>
          `${label.id}:${label.x.toFixed(1)}:${label.y.toFixed(1)}:${label.fallback ? 'fallback' : 'placed'}`,
      )
      .join('|');
    if (signature === this.labelSignature) return;
    this.labelSignature = signature;
    this.blockedLabels.set(new Set());
    this.labelLayout.set(labels);
    requestAnimationFrame(() => this.zone.run(() => this.validateRenderedLabels()));
  }

  private measureLabelBoxes(
    svg: SVGSVGElement,
    shapes: readonly GovernorateShape[],
  ): Map<string, { x: number; y: number; width: number; height: number }> {
    const namespace = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(namespace, 'g');
    group.setAttribute('visibility', 'hidden');
    group.setAttribute('pointer-events', 'none');
    group.setAttribute('aria-hidden', 'true');
    svg.appendChild(group);
    const boxes = new Map<string, { x: number; y: number; width: number; height: number }>();
    const scope = [...svg.attributes].find((attribute) =>
      attribute.name.startsWith('_ngcontent'),
    )?.name;

    for (const shape of shapes) {
      const text = document.createElementNS(namespace, 'text');
      text.setAttribute('class', 'map-label');
      if (scope) text.setAttribute(scope, '');
      text.setAttribute('x', '0');
      text.setAttribute('y', '0');
      text.setAttribute('dy', '-0.32em');
      text.setAttribute('text-anchor', 'middle');
      text.textContent = shape.city.name.toUpperCase();
      group.appendChild(text);
      const box = text.getBBox();
      boxes.set(shape.id, {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      });
    }

    group.remove();
    return boxes;
  }

  private validateRenderedLabels(): void {
    const labels = this.labelLayout();
    const svg = this.svgRef()?.nativeElement;
    if (!svg || labels.length === 0) return;
    const blocked = new Set(this.blockedLabels());
    let changed = false;

    for (const label of labels) {
      if (blocked.has(label.id) || label.fallback) continue;
      const text = svg.querySelector<SVGTextElement>(
        `text.map-label[data-label-city="${label.id}"]`,
      );
      const path = svg.querySelector<SVGPathElement>(`path.gov[data-city="${label.id}"]`);
      if (!text || !path) continue;
      const box = text.getBBox();
      const points: [number, number][] = [
        [box.x, box.y],
        [box.x + box.width, box.y],
        [box.x, box.y + box.height],
        [box.x + box.width, box.y + box.height],
        [box.x + box.width / 2, box.y],
        [box.x + box.width / 2, box.y + box.height],
        [box.x, box.y + box.height / 2],
        [box.x + box.width, box.y + box.height / 2],
        [box.x + box.width / 2, box.y + box.height / 2],
      ];
      const inside = points.every(([x, y]) => path.isPointInFill(new DOMPoint(x, y)));
      if (!inside) {
        blocked.add(label.id);
        changed = true;
      }
    }

    if (changed) this.blockedLabels.set(blocked);
  }

  private observeViewport(): void {
    const host = this.host.nativeElement;
    const apply = (width: number, height: number): void => {
      if (width < 2 || height < 2) return;
      this.zone.run(() => this.geometry.setViewport(width, height));
    };

    const rect = host.getBoundingClientRect();
    apply(rect.width, rect.height);

    const fonts = host.ownerDocument.fonts;
    if (fonts) {
      void fonts.ready.then(() =>
        this.zone.run(() => {
          this.layoutLabels();
          this.validateRenderedLabels();
        }),
      );
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (this.resizeTimer !== null) window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        this.resizeTimer = null;
        apply(entry.contentRect.width, entry.contentRect.height);
      }, 110);
    });
    this.resizeObserver.observe(host);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function overlaps(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number },
): boolean {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}
