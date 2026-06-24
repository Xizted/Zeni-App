export interface BackoffOptions {
  attempt: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  random?: () => number;
}

export function calculateBackoffDelay({
  attempt,
  baseDelayMs = 1_000,
  maxDelayMs = 30_000,
  random = Math.random,
}: BackoffOptions): number {
  const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt));
  const jitter = 0.5 + random() * 0.5;
  return Math.round(exponentialDelay * jitter);
}
