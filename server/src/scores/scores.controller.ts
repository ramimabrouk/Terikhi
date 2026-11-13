import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ScoresService, type PuzzleMode, type PuzzleScore } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scores: ScoresService) {}

  /** GET /api/scores?mode=easy&limit=8 */
  @Get()
  top(@Query('mode') mode?: string, @Query('limit') limit?: string): Promise<PuzzleScore[]> {
    const safeMode: PuzzleMode = mode === 'expert' ? 'expert' : 'easy';
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    return this.scores.top(safeMode, safeLimit);
  }

  /** POST /api/scores { name, mode, timeMs, moves } */
  @Post()
  @HttpCode(201)
  add(@Body() body: unknown): Promise<PuzzleScore> {
    return this.scores.add(body);
  }
}
