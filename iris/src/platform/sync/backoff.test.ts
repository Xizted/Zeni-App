import { calculateBackoffDelay } from './backoff';

describe('calculateBackoffDelay', () => {
  it('applies exponential growth, jitter, and a maximum delay', () => {
    expect(calculateBackoffDelay({ attempt: 2, random: () => 1 })).toBe(4_000);
    expect(calculateBackoffDelay({ attempt: 20, random: () => 1 })).toBe(30_000);
    expect(calculateBackoffDelay({ attempt: 0, random: () => 0 })).toBe(500);
  });
});
