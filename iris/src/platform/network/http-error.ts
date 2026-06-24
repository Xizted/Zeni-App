import { isAxiosError } from 'axios';

export type HttpErrorKind =
  | 'cancelled'
  | 'client'
  | 'network'
  | 'server'
  | 'unauthorized'
  | 'unknown';

export class HttpError extends Error {
  constructor(
    message: string,
    readonly kind: HttpErrorKind,
    readonly status?: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  get retryable(): boolean {
    return this.kind === 'network' || this.kind === 'server';
  }
}

export function normalizeHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (!isAxiosError(error)) {
    return new HttpError('An unexpected network error occurred.', 'unknown', undefined, error);
  }

  if (error.code === 'ERR_CANCELED') {
    return new HttpError('The request was cancelled.', 'cancelled');
  }

  const status = error.response?.status;
  if (!status) {
    return new HttpError('Atenea is unreachable.', 'network', undefined, error.cause);
  }

  if (status === 401) {
    return new HttpError('Authentication is required.', 'unauthorized', status, error.response?.data);
  }

  if (status >= 500) {
    return new HttpError('Atenea could not complete the request.', 'server', status, error.response?.data);
  }

  return new HttpError('Atenea rejected the request.', 'client', status, error.response?.data);
}
