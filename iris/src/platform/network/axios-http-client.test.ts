import { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { AxiosHttpClient } from './axios-http-client';
import { HttpError } from './http-error';

describe('AxiosHttpClient', () => {
  it('maps Axios responses and forwards idempotency and cancellation metadata', async () => {
    const request = jest.fn(async () => ({
      data: { id: 'transaction-1' },
      headers: { 'x-request-id': 'request-1' },
      status: 201,
    }));
    const client = new AxiosHttpClient({ request } as unknown as AxiosInstance);
    const controller = new AbortController();

    const response = await client.request<{ id: string }, { amount: number }>({
      body: { amount: 42 },
      idempotencyKey: 'mutation-1',
      method: 'POST',
      path: '/transactions',
      signal: controller.signal,
    });

    expect(response).toEqual({
      data: { id: 'transaction-1' },
      headers: { 'x-request-id': 'request-1' },
      status: 201,
    });
    expect(request).toHaveBeenCalledWith({
      data: { amount: 42 },
      headers: { 'Idempotency-Key': 'mutation-1' },
      method: 'POST',
      signal: controller.signal,
      url: '/transactions',
    });
  });

  it('normalizes server failures into retryable transport errors', async () => {
    const response = {
      config: {} as InternalAxiosRequestConfig,
      data: { message: 'unavailable' },
      headers: {},
      status: 503,
      statusText: 'Service Unavailable',
    };
    const request = jest.fn(async () => {
      throw new AxiosError('unavailable', 'ERR_BAD_RESPONSE', undefined, undefined, response);
    });
    const client = new AxiosHttpClient({ request } as unknown as AxiosInstance);

    await expect(client.request({ method: 'GET', path: '/health' })).rejects.toMatchObject<
      Partial<HttpError>
    >({
      kind: 'server',
      retryable: true,
      status: 503,
    });
    expect(request).toHaveBeenCalledWith({
      data: undefined,
      headers: {},
      method: 'GET',
      signal: undefined,
      url: '/health',
    });
  });
});
