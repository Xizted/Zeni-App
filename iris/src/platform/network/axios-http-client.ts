import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { HttpClient, HttpRequest, HttpResponse } from './http-client';
import { normalizeHttpError } from './http-error';

export class AxiosHttpClient implements HttpClient {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  async request<TData, TBody = undefined>({
    method,
    path,
    body,
    headers,
    idempotencyKey,
    signal,
  }: HttpRequest<TBody>): Promise<HttpResponse<TData>> {
    const config: AxiosRequestConfig<TBody> = {
      data: body,
      headers: {
        ...headers,
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      method,
      signal,
      url: path,
    };

    try {
      const response = await this.axiosInstance.request<
        TData,
        AxiosResponse<TData, TBody>,
        TBody
      >(config);

      return {
        data: response.data,
        headers: Object.fromEntries(
          Object.entries(response.headers).map(([key, value]) => [key, String(value)]),
        ),
        status: response.status,
      };
    } catch (error) {
      throw normalizeHttpError(error);
    }
  }
}
