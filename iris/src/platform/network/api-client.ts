import { create } from 'axios';

import { getRuntimeConfig } from '@/platform/config/runtime-config';

import { AxiosHttpClient } from './axios-http-client';
import { installAuthInterceptors, type AuthSessionCoordinator } from './auth-interceptors';

const axiosInstance = create({
  baseURL: getRuntimeConfig().apiBaseUrl,
  headers: { Accept: 'application/json' },
  timeout: 15_000,
});

export const apiClient = new AxiosHttpClient(axiosInstance);

export function configureApiAuthentication(session: AuthSessionCoordinator): () => void {
  return installAuthInterceptors(axiosInstance, session);
}
