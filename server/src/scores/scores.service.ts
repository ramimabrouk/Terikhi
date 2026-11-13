import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonStoreService } from '../storage/json-store.service';

export type PuzzleMode = 'easy' | 'expert';

export interface PuzzleScore {
  name: string;
  mode: PuzzleMode;
  timeMs: number;
  moves: number;
  createdAt: string;
}

const FILE = 'scores';
const MAX_KEPT = 200;

@Injectable()
export class ScoresService {
  constructor(private readonly store: JsonStoreService) {}

  async top(mode: PuzzleMode, limit: number): Promise<PuzzleScore[]> {
    const scores = await this.store.read<PuzzleScore[]>(FILE, []);
    return scores
      .filter((score) => score.mode === mode)
      .sort(byRank)
      .slice(0, limit);
  }

  async add(input: unknown): Promise<PuzzleScore> {
    const score = this.validate(input);
    await this.store.update<PuzzleScore[]>(FILE, [], (scores) =>
      [...scores, score].sort(byRank).slice(0, MAX_KEPT),
    );
    return score;
  }

  private validate(input: unknown): PuzzleScore {
    if (typeof input !== 'object' || input === null) {
      throw new BadRequestException('Body must be a JSON object');
    }
    const body = input as Record<string, unknown>;
    const name = typeof body['name'] === 'string' ? body['name'].trim().slice(0, 24) : '';
    const mode = body['mode'];
    const timeMs = Number(body['timeMs']);
    const moves = Number(body['moves']);
    if (mode !== 'easy' && mode !== 'expert') {
      throw new BadRequestException('mode must be "easy" or "expert"');
    }
    // 24 pieces cannot honestly be placed in under 5 s or in fewer than 24 moves.
    if (!Number.isFinite(timeMs) || timeMs < 5000 || timeMs > 24 * 3600 * 1000) {
      throw new BadRequestException('timeMs is out of range');
    }
    if (!Number.isInteger(moves) || moves < 24 || moves > 10000) {
      throw new BadRequestException('moves is out of range');
    }
    return {
      name: name.replace(/[<>]/g, '') || 'Anonyme',
      mode,
      timeMs: Math.round(timeMs),
      moves,
      createdAt: new Date().toISOString(),
    };
  }
}

function byRank(a: PuzzleScore, b: PuzzleScore): number {
  return a.timeMs - b.timeMs || a.moves - b.moves;
}
