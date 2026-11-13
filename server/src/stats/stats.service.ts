import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonStoreService } from '../storage/json-store.service';

const FILE = 'views';

/** The 24 governorate ids used by the Angular atlas. */
export const GOVERNORATE_IDS = new Set([
  'tunis', 'ariana', 'ben-arous', 'manouba', 'nabeul', 'bizerte', 'beja', 'jendouba',
  'le-kef', 'siliana', 'zaghouan', 'sousse', 'monastir', 'mahdia', 'sfax', 'kairouan',
  'kasserine', 'sidi-bouzid', 'gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili',
]);

export interface PopularCity {
  cityId: string;
  views: number;
}

@Injectable()
export class StatsService {
  constructor(private readonly store: JsonStoreService) {}

  async record(cityId: string): Promise<PopularCity> {
    if (!GOVERNORATE_IDS.has(cityId)) {
      throw new BadRequestException(`Unknown governorate "${cityId}"`);
    }
    const views = await this.store.update<Record<string, number>>(FILE, {}, (current) => ({
      ...current,
      [cityId]: (current[cityId] ?? 0) + 1,
    }));
    return { cityId, views: views[cityId] };
  }

  async summary(limit: number): Promise<{ total: number; top: PopularCity[] }> {
    const views = await this.store.read<Record<string, number>>(FILE, {});
    const entries = Object.entries(views).map(([cityId, count]) => ({ cityId, views: count }));
    return {
      total: entries.reduce((sum, entry) => sum + entry.views, 0),
      top: entries.sort((a, b) => b.views - a.views).slice(0, limit),
    };
  }
}
