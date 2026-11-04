import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AtlasStore } from '../core/atlas.store';
import { GeometryService } from '../core/geometry.service';
import { CityDetailComponent } from '../detail/city-detail.component';
import { CityIndexComponent } from '../index/city-index.component';
import { TunisiaMapComponent } from '../map/map.component';
import { AtlasIntroComponent } from '../ui/atlas-intro.component';
import { HannibalCardComponent } from '../ui/hannibal-card.component';
import { CITIES, REGIONS, type Region } from '../data/cities.data';

const INTRO_KEY = 'tunisia-explorer:intro';

function formatDms(value: number, positive: string, negative: string): string {
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.round((absolute - degrees) * 60);
  const safeMinutes = minutes === 60 ? 0 : minutes;
  const safeDegrees = minutes === 60 ? degrees + 1 : degrees;
  const direction = value >= 0 ? positive : negative;
  return `${safeDegrees}°${safeMinutes.toString().padStart(2, '0')}′ ${direction}`;
}

@Component({
  selector: 'app-atlas-page',
  imports: [
    TunisiaMapComponent,
    CityIndexComponent,
    CityDetailComponent,
    AtlasIntroComponent,
    HannibalCardComponent,
  ],
  templateUrl: './atlas.page.html',
  styleUrl: './atlas.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtlasPage {
  readonly store = inject(AtlasStore);
  readonly geometry = inject(GeometryService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly introOpen = signal(false);
  readonly mapReveal = signal(false);

  readonly selected = this.store.selected;
  readonly sheetOpen = this.store.sheetOpen;
  readonly regionFilter = this.store.regionFilter;
  readonly panelOpen = computed(() => this.selected() !== null || this.sheetOpen());

  readonly regions: { region: Region; count: number }[] = REGIONS.map((region) => ({
    region,
    count: CITIES.filter((city) => city.region === region).length,
  }));

  readonly coordinate = computed(() => {
    const city = this.selected();
    const shape = city ? this.geometry.shapeByCityId().get(city.id) : null;
    const lat = shape?.lonLat[1] ?? 36.8065;
    const lon = shape?.lonLat[0] ?? 10.1815;
    return `${formatDms(lat, 'N', 'S')} · ${formatDms(lon, 'E', 'O')}`;
  });

  constructor() {
    const seen = this.readIntroSeen();
    this.introOpen.set(!seen);
    this.mapReveal.set(seen);
    void this.geometry.load();
    this.document.addEventListener('keydown', this.onKeydown);
    this.destroyRef.onDestroy(() => this.document.removeEventListener('keydown', this.onKeydown));
  }

  onIntroExit(): void {
    this.markIntroSeen();
  }

  onIntroClosed(): void {
    this.introOpen.set(false);
    this.mapReveal.set(true);
  }

  openIndex(): void {
    this.store.openIndex();
  }

  toggleSheet(): void {
    this.store.toggleSheet();
  }

  toggleRegion(region: Region): void {
    this.store.toggleRegion(region);
  }

  clearRegion(): void {
    this.store.clearRegion();
  }

  private readIntroSeen(): boolean {
    try {
      return window.sessionStorage.getItem(INTRO_KEY) === '1';
    } catch {
      return false;
    }
  }

  private markIntroSeen(): void {
    try {
      window.sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      return;
    }
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (this.introOpen()) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

    const target = event.target;
    const typing =
      target instanceof HTMLElement &&
      target.closest('input, textarea, select, [contenteditable="true"]') !== null;

    if (event.key === 'Escape') {
      if (this.selected()) {
        event.preventDefault();
        this.store.back();
        return;
      }
      if (this.sheetOpen()) {
        event.preventDefault();
        this.store.closeSheet();
      }
      return;
    }

    if (typing) return;

    if (event.key === '/') {
      event.preventDefault();
      this.store.openIndex();
      return;
    }

    if (this.selected() && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      if (event.key === 'ArrowLeft') this.store.goPrevious();
      else this.store.goNext();
    }
  };
}
