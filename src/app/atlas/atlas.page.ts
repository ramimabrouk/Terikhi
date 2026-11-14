import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AtlasStore } from '../core/atlas.store';
import { GeometryService } from '../core/geometry.service';
import { LanguageService } from '../core/language.service';
import { CityDetailComponent } from '../detail/city-detail.component';
import { CityIndexComponent } from '../index/city-index.component';
import { TunisiaMapComponent } from '../map/map.component';
import { AtlasIntroComponent } from '../ui/atlas-intro.component';
import { ElissaComponent } from '../ui/elissa.component';
import { EagleCursorComponent } from '../ui/eagle-cursor.component';
import { FxLayerComponent } from '../ui/fx-layer.component';
import { NarrationControlComponent } from '../ui/narration-control.component';
import { RegionEmblemComponent } from '../map/region-emblem.component';
import { MapPuzzleComponent } from '../puzzle/map-puzzle.component';
import { NarrationDirectorService } from '../core/narration-director.service';
import { ApiService } from '../core/api.service';
import { PhotoGalleryComponent } from '../gallery/photo-gallery.component';
import type { GalleryRequest } from '../gallery/photo-gallery.component';
import { CITIES, CITY_BY_ID, REGIONS, type Region } from '../data/cities.data';

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
    ElissaComponent,
    EagleCursorComponent,
    FxLayerComponent,
    NarrationControlComponent,
    RegionEmblemComponent,
    MapPuzzleComponent,
    PhotoGalleryComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './atlas.page.html',
  styleUrl: './atlas.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtlasPage {
  readonly store = inject(AtlasStore);
  readonly geometry = inject(GeometryService);
  readonly i18n = inject(LanguageService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly api = inject(ApiService);
  readonly introOpen = signal(false);
  readonly puzzleOpen = signal(false);
  readonly mapReveal = signal(false);
  readonly galleryRequest = signal<GalleryRequest | null>(null);

  readonly selected = this.store.selected;
  readonly sheetOpen = this.store.sheetOpen;
  readonly regionFilter = this.store.regionFilter;
  readonly panelOpen = computed(() => this.selected() !== null || this.sheetOpen());
  readonly activeGalleryRequest = computed(() => {
    const request = this.galleryRequest();
    return request && request.cityId === this.selected()?.id ? request : null;
  });

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
    let lastViewed: string | null = null;
    effect(() => {
      const id = this.store.selectedId();
      if (id && id !== lastViewed) untracked(() => this.api.recordView(id));
      lastViewed = id;
    });
    const seen = this.readIntroSeen();
    this.introOpen.set(!seen);
    this.mapReveal.set(seen);
    void this.geometry.load();
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId && CITY_BY_ID.has(routeId)) this.store.select(routeId);
    inject(NarrationDirectorService).start(this.destroyRef);
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

  regionLabel(region: Region): string {
    return this.i18n.t(
      region === 'Nord' ? 'north' : region === 'Centre' ? 'centre' : 'south',
    );
  }

  onCitySelected(id: string): void {
    this.galleryRequest.set(null);
    this.store.select(id);
    void this.router.navigate(['/gouvernorat', id]);
  }

  openPuzzle(): void {
    this.puzzleOpen.set(true);
  }

  closePuzzle(): void {
    this.puzzleOpen.set(false);
  }

  onMapCleared(): void {
    this.galleryRequest.set(null);
    this.store.back();
    void this.router.navigateByUrl('/');
  }

  closeGallery(): void {
    this.galleryRequest.set(null);
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
    if (this.introOpen() || this.puzzleOpen()) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

    const target = event.target;
    const typing =
      target instanceof HTMLElement &&
      target.closest('input, textarea, select, [contenteditable="true"]') !== null;

    if (event.key === 'Escape') {
      if (this.selected()) {
        event.preventDefault();
        this.onMapCleared();
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
