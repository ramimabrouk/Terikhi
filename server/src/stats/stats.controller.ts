import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StatsService, type PopularCity } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  /** POST /api/stats/views/:cityId — called each time a governorate sheet opens. */
  @Post('views/:cityId')
  record(@Param('cityId') cityId: string): Promise<PopularCity> {
    return this.stats.record(cityId);
  }

  /** GET /api/stats/views?limit=3 — most explored governorates. */
  @Get('views')
  summary(@Query('limit') limit?: string): Promise<{ total: number; top: PopularCity[] }> {
    return this.stats.summary(Math.min(Math.max(Number(limit) || 5, 1), 24));
  }
}
