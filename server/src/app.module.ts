import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ScoresModule } from './scores/scores.module';
import { StatsModule } from './stats/stats.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [StorageModule, ScoresModule, StatsModule],
  controllers: [HealthController],
})
export class AppModule {}
