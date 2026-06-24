export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export interface HttpRequest<TBody = undefined> {
  method: HttpMethod;
  path: string;
  body?: TBody;
  headers?: Readonly<Record<string, string>>;
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export interface HttpResponse<TData> {
  data: TData;
  headers: Readonly<Record<string, string>>;
  status: number;
}

export interface HttpClient {
  request<TData, TBody = undefined>(request: HttpRequest<TBody>): Promise<HttpResponse<TData>>;
}
