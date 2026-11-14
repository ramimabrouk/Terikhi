import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ScoresModule } from './scores/scores.module';
import { StatsModule } from './stats/stats.module';
import { StorageModule } from './storage/storage.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [StorageModule, ScoresModule, StatsModule, ContactModule],
  controllers: [HealthController],
})
export class AppModule {}
