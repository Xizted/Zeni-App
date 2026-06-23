import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { RedisService } from '../cache/redis.service';
import { PrismaService } from '../database/prisma.service';

const HEALTH_CHECK_TIMEOUT_MS = 1_000;

class HealthCheckTimeoutError extends Error {}

const withTimeout = async (
  operation: Promise<void>,
  timeoutMs: number,
): Promise<void> => {
  let timeout: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(
      () => reject(new HealthCheckTimeoutError()),
      timeoutMs,
    );
  });

  try {
    await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly database: PrismaService,
  ) {}

  async check(): Promise<HealthIndicatorResult<'database'>> {
    const check = this.healthIndicator.check('database');
    try {
      await withTimeout(this.database.ping(), HEALTH_CHECK_TIMEOUT_MS);
      return check.up();
    } catch (error) {
      return error instanceof HealthCheckTimeoutError
        ? check.down(`timeout of ${HEALTH_CHECK_TIMEOUT_MS}ms exceeded`)
        : check.down();
    }
  }
}

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthIndicatorResult<'redis'>> {
    const check = this.healthIndicator.check('redis');
    try {
      await withTimeout(this.redis.ping(), HEALTH_CHECK_TIMEOUT_MS);
      return check.up();
    } catch (error) {
      return error instanceof HealthCheckTimeoutError
        ? check.down(`timeout of ${HEALTH_CHECK_TIMEOUT_MS}ms exceeded`)
        : check.down();
    }
  }
}
