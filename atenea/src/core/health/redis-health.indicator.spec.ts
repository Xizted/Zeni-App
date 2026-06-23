import { HealthIndicatorService } from '@nestjs/terminus';
import { RedisService } from '../cache/redis.service';
import { RedisHealthIndicator } from './redis-health.indicator';

describe('RedisHealthIndicator', () => {
  const healthIndicator = new HealthIndicatorService();

  afterEach(() => {
    jest.useRealTimers();
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

  it('bounds the Redis check to one second', async () => {
    jest.useFakeTimers();
    const redis = {
      ping: jest.fn(() => new Promise<void>(() => undefined)),
    } as unknown as RedisService;
    const indicator = new RedisHealthIndicator(healthIndicator, redis);

    const result = indicator.check();
    await jest.advanceTimersByTimeAsync(1_000);

    await expect(result).resolves.toEqual({
      redis: { status: 'down' },
    });
  });
});
