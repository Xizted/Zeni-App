import { HttpError } from '@/platform/network/http-error';

import { createQueryClient } from './query-client';

describe('query client', () => {
  it('retries transient errors but not rejected client requests', () => {
    const queryClient = createQueryClient();
    const retry = queryClient.getDefaultOptions().queries?.retry;

    expect(typeof retry).toBe('function');
    if (typeof retry !== 'function') {
      return;
    }

    expect(retry(0, new HttpError('offline', 'network'))).toBe(true);
    expect(retry(0, new HttpError('invalid', 'client', 422))).toBe(false);
    expect(retry(2, new HttpError('offline', 'network'))).toBe(false);
  });
});
