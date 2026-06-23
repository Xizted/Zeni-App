import { HealthIndicatorService } from '@nestjs/terminus';
import { RedisService } from '../cache/redis.service';
import { PrismaService } from '../database/prisma.service';
import {
  DatabaseHealthIndicator,
  RedisHealthIndicator,
} from './dependency-health.indicators';

describe('Dependency health indicators', () => {
  const healthIndicator = new HealthIndicatorService();

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports the database as up when its ping succeeds', async () => {
    const database = {
      ping: jest.fn().mockResolvedValue(undefined),
    } as unknown as PrismaService;
    const indicator = new DatabaseHealthIndicator(healthIndicator, database);

    await expect(indicator.check()).resolves.toEqual({
      database: { status: 'up' },
    });
  });

  it('reports Redis as down without exposing infrastructure errors', async () => {
    const redis = {
      ping: jest.fn().mockRejectedValue(new Error('secret connection detail')),
    } as unknown as RedisService;
    const indicator = new RedisHealthIndicator(healthIndicator, redis);

    await expect(indicator.check()).resolves.toEqual({
      redis: { status: 'down' },
    });
  });

  it('bounds dependency checks to one second', async () => {
    jest.useFakeTimers();
    const database = {
      ping: jest.fn(() => new Promise<void>(() => undefined)),
    } as unknown as PrismaService;
    const indicator = new DatabaseHealthIndicator(healthIndicator, database);

    const result = indicator.check();
    await jest.advanceTimersByTimeAsync(1_000);

    await expect(result).resolves.toEqual({
      database: { status: 'down', message: 'timeout of 1000ms exceeded' },
    });
  });
});
