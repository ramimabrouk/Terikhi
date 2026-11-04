import { Injectable, computed, signal } from '@angular/core';
import {
  CITIES,
  CITY_BY_ID,
  SECTION_LABELS,
  type Region,
  type SectionId,
  type TunisianCity,
} from '../data/cities.data';

export interface AtlasPosition {
  index: number;
  total: number;
}

export function foldText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function citySearchText(city: TunisianCity): string {
  const highlights = city.sections.flatMap((section) =>
    section.highlights.map((highlight) => highlight.title),
  );
  return foldText(
    [city.name, city.nameAr, city.region, city.tagline, ...city.knownFor, ...highlights].join(' '),
  );
}

@Injectable({ providedIn: 'root' })
export class AtlasStore {
  readonly selectedId = signal<string | null>(null);
  readonly lastViewedId = signal<string | null>(null);
  readonly selected = computed<TunisianCity | null>(() => {
    const id = this.selectedId();
    return id ? (CITY_BY_ID.get(id) ?? null) : null;
  });

  readonly regionFilter = signal<Region | null>(null);
  readonly query = signal('');
  readonly sectionId = signal<SectionId>('history');
  readonly sheetOpen = signal(false);
  readonly searchFocusTick = signal(0);

  readonly order = computed<readonly TunisianCity[]>(() => {
    const region = this.regionFilter();
    return region ? CITIES.filter((city) => city.region === region) : CITIES;
  });

  readonly navigation = computed<readonly TunisianCity[]>(() => {
    const city = this.selected();
    const order = this.order();
    if (!city) return order;
    return order.some((item) => item.id === city.id) ? order : CITIES;
  });

  readonly position = computed<AtlasPosition | null>(() => {
    const city = this.selected();
    if (!city) return null;
    const order = this.navigation();
    const index = order.findIndex((item) => item.id === city.id);
    if (index < 0) return null;
    return { index: index + 1, total: order.length };
  });

  readonly previous = computed<TunisianCity | null>(() => {
    const city = this.selected();
    const order = this.navigation();
    if (!city || order.length === 0) return null;
    const index = order.findIndex((item) => item.id === city.id);
    return order[(index - 1 + order.length) % order.length];
  });

  readonly next = computed<TunisianCity | null>(() => {
    const city = this.selected();
    const order = this.navigation();
    if (!city || order.length === 0) return null;
    const index = order.findIndex((item) => item.id === city.id);
    return order[(index + 1) % order.length];
  });

  readonly filteredCities = computed<readonly TunisianCity[]>(() => {
    const region = this.regionFilter();
    const terms = foldText(this.query().trim()).split(/\s+/).filter(Boolean);
    return CITIES.filter((city) => {
      if (region && city.region !== region) return false;
      if (terms.length === 0) return true;
      const haystack = citySearchText(city);
      return terms.every((term) => haystack.includes(term));
    });
  });

  readonly liveMessage = computed(() => {
    const city = this.selected();
    if (!city) return 'Carte de Tunisie : 24 gouvernorats.';
    return `${city.name}, région ${city.region}. Rubrique ${SECTION_LABELS[this.sectionId()]}.`;
  });

  select(id: string): void {
    const city = CITY_BY_ID.get(id);
    if (!city) return;
    const region = this.regionFilter();
    if (region && city.region !== region) {
      this.regionFilter.set(null);
    }
    if (this.selectedId() !== id) {
      this.sectionId.set('history');
    }
    this.selectedId.set(id);
    this.lastViewedId.set(id);
    this.sheetOpen.set(true);
  }

  back(): void {
    this.selectedId.set(null);
    this.sheetOpen.set(false);
  }

  goPrevious(): void {
    this.step(-1);
  }

  goNext(): void {
    this.step(1);
  }

  setSection(section: SectionId): void {
    this.sectionId.set(section);
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  toggleRegion(region: Region): void {
    this.regionFilter.update((current) => (current === region ? null : region));
  }

  clearRegion(): void {
    this.regionFilter.set(null);
  }

  openIndex(): void {
    this.selectedId.set(null);
    this.sheetOpen.set(true);
    this.searchFocusTick.update((tick) => tick + 1);
  }

  toggleSheet(): void {
    this.sheetOpen.update((open) => !open);
  }

  closeSheet(): void {
    this.sheetOpen.set(false);
  }

  private step(direction: 1 | -1): void {
    const city = this.selected();
    const order = this.navigation();
    if (!city || order.length === 0) return;
    const index = order.findIndex((item) => item.id === city.id);
    const target = order[(index + direction + order.length) % order.length];
    if (!target) return;
    this.selectedId.set(target.id);
    this.lastViewedId.set(target.id);
    this.sheetOpen.set(true);
  }
}
