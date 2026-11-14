import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

export type PuzzleMode = 'easy' | 'expert';

export interface PuzzleScore {
  name: string;
  mode: PuzzleMode;
  timeMs: number;
  moves: number;
  createdAt: string;
}

export interface PopularCity {
  cityId: string;
  views: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

const LOCAL_SCORES = 'tunisia-explorer:scores';
const LOCAL_VIEWS = 'tunisia-explorer:views';
const API = '/api';

/**
 * Talks to the NestJS backend (see /server). Every call degrades gracefully to
 * localStorage, so the atlas keeps working when the backend is not running.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly online = signal<boolean | null>(null);

  async topScores(mode: PuzzleMode, limit = 8): Promise<PuzzleScore[]> {
    try {
      const scores = await firstValueFrom(
        this.http
          .get<PuzzleScore[]>(`${API}/scores`, { params: { mode, limit } })
          .pipe(timeout(2500)),
      );
      this.online.set(true);
      return scores;
    } catch {
      this.online.set(false);
      return this.localScores()
        .filter((score) => score.mode === mode)
        .sort(byTime)
        .slice(0, limit);
    }
  }

  async saveScore(score: Omit<PuzzleScore, 'createdAt'>): Promise<void> {
    const local: PuzzleScore = { ...score, createdAt: new Date().toISOString() };
    this.writeLocal(LOCAL_SCORES, [...this.localScores(), local].sort(byTime).slice(0, 50));
    try {
      await firstValueFrom(this.http.post(`${API}/scores`, score).pipe(timeout(2500)));
      this.online.set(true);
    } catch {
      this.online.set(false);
    }
  }

  recordView(cityId: string): void {
    const views = this.readLocal<Record<string, number>>(LOCAL_VIEWS, {});
    views[cityId] = (views[cityId] ?? 0) + 1;
    this.writeLocal(LOCAL_VIEWS, views);
    this.http
      .post(`${API}/stats/views/${encodeURIComponent(cityId)}`, {})
      .pipe(timeout(2500))
      .subscribe({
        next: () => this.online.set(true),
        error: () => this.online.set(false),
      });
  }

  async popular(limit = 3): Promise<PopularCity[]> {
    try {
      const result = await firstValueFrom(
        this.http
          .get<{ top: PopularCity[] }>(`${API}/stats/views`, { params: { limit } })
          .pipe(timeout(2500)),
      );
      this.online.set(true);
      return result.top;
    } catch {
      this.online.set(false);
      const views = this.readLocal<Record<string, number>>(LOCAL_VIEWS, {});
      return Object.entries(views)
        .map(([cityId, count]) => ({ cityId, views: count }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }

  }

  async sendContact(payload: ContactPayload): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API}/contact`, payload).pipe(timeout(5000)));
  }

  private localScores(): PuzzleScore[] {
    return this.readLocal<PuzzleScore[]>(LOCAL_SCORES, []);
  }

  private readLocal<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private writeLocal(key: string, value: unknown): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }
}

function byTime(a: PuzzleScore, b: PuzzleScore): number {
  return a.timeMs - b.timeMs || a.moves - b.moves;
}
