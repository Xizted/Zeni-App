import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { RedisService } from '../cache/redis.service';

const HEALTH_CHECK_TIMEOUT_MS = 1_000;

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthIndicatorResult<'redis'>> {
    const check = this.healthIndicator.check('redis');
    let timeout: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(
        () => reject(new Error('Redis health check timed out')),
        HEALTH_CHECK_TIMEOUT_MS,
      );
    });

    try {
      await Promise.race([this.redis.ping(), timeoutPromise]);
      return check.up();
    } catch {
      return check.down();
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}
