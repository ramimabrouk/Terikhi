import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { pad2 } from '../core/format';
import { AtlasStore } from '../core/atlas.store';
import { MotionService } from '../core/motion.service';
import { CITIES, REGIONS, type TunisianCity } from '../data/cities.data';

@Component({
  selector: 'app-city-index',
  templateUrl: './city-index.component.html',
  styleUrl: './city-index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityIndexComponent implements OnDestroy {
  readonly store = inject(AtlasStore);
  private readonly motion = inject(MotionService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly indexScroll = viewChild<ElementRef<HTMLElement>>('indexScroll');

  readonly regions = REGIONS;
  readonly filteredCities = this.store.filteredCities;
  readonly query = this.store.query;
  readonly regionFilter = this.store.regionFilter;
  readonly showScrollCue = signal(true);

  readonly groups = computed(() => {
    const cities = this.filteredCities();
    return REGIONS.map((region) => ({
      region,
      cities: cities.filter((city) => city.region === region),
    })).filter((group) => group.cities.length > 0);
  });

  private rowsCtx: gsap.Context | null = null;
  private lastRevealedId: string | null = null;
  private scrollEl: HTMLElement | null = null;

  constructor() {
    afterRenderEffect(() => {
      if (this.store.searchFocusTick() === 0) return;
      this.searchInput()?.nativeElement.focus({ preventScroll: true });
    });

    afterRenderEffect(() => {
      this.store.sheetOpen();
      this.store.lastViewedId();
      requestAnimationFrame(() => this.revealLastViewed());
    });

    afterNextRender(() => {
      requestAnimationFrame(() => this.revealLastViewed());
      if (this.motion.reduced()) return;
      const rows = this.host.nativeElement.querySelectorAll<HTMLElement>('.city-row');
      if (rows.length === 0) return;
      this.rowsCtx = gsap.context(() => {
        gsap.fromTo(
          rows,
          { y: 10, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.016,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform',
          },
        );
      }, this.host.nativeElement);
    });

    afterNextRender(() => {
      const scroll = this.indexScroll()?.nativeElement;
      if (!scroll) return;
      this.scrollEl = scroll;
      scroll.addEventListener('scroll', this.onIndexScroll, { passive: true });
      this.updateScrollCue();
    });

    afterRenderEffect(() => {
      this.filteredCities();
      requestAnimationFrame(() => this.updateScrollCue());
    });
  }

  ngOnDestroy(): void {
    this.rowsCtx?.revert();
    this.scrollEl?.removeEventListener('scroll', this.onIndexScroll);
  }

  onQuery(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.store.setQuery(target.value);
    }
  }

  clearQuery(): void {
    this.store.setQuery('');
    this.searchInput()?.nativeElement.focus({ preventScroll: true });
  }

  open(city: TunisianCity): void {
    this.store.select(city.id);
  }

  number(city: TunisianCity): string {
    return pad2(CITIES.indexOf(city) + 1);
  }

  private revealLastViewed(): void {
    const id = this.store.lastViewedId();
    if (!id || this.lastRevealedId === id) return;
    const scroll = this.indexScroll()?.nativeElement;
    if (!scroll || scroll.clientHeight < 20) return;
    const row = scroll.querySelector<HTMLElement>(`[data-city="${id}"]`);
    if (!row) return;
    const rowRect = row.getBoundingClientRect();
    const scrollRect = scroll.getBoundingClientRect();
    const top =
      scroll.scrollTop + rowRect.top - scrollRect.top - (scroll.clientHeight - rowRect.height) / 2;
    scroll.scrollTo({
      top: Math.max(0, top),
      behavior: this.motion.reduced() ? 'auto' : 'smooth',
    });
    this.lastRevealedId = id;
  }

  private readonly onIndexScroll = (): void => {
    this.updateScrollCue();
  };

  private updateScrollCue(): void {
    const scroll = this.scrollEl;
    if (!scroll) return;
    this.showScrollCue.set(scroll.scrollTop + scroll.clientHeight < scroll.scrollHeight - 12);
  }
}
