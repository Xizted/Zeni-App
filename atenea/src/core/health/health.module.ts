import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import {
  DatabaseHealthIndicator,
  RedisHealthIndicator,
} from './dependency-health.indicators';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
