import { AxiosHeaders, type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export interface AuthSessionCoordinator {
  clear(): Promise<void>;
  getAccessToken(): string | null;
  refresh(): Promise<string>;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  authRetryAttempted?: boolean;
};

export function installAuthInterceptors(
  axiosInstance: AxiosInstance,
  session: AuthSessionCoordinator,
  refreshPath = '/auth/refresh',
): () => void {
  const requestInterceptor = axiosInstance.interceptors.request.use((config) => {
    const accessToken = session.getAccessToken();
    if (accessToken) {
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  });

  const responseInterceptor = axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetriableRequestConfig | undefined;
      const shouldRefresh =
        error.response?.status === 401 &&
        config !== undefined &&
        config.url !== refreshPath &&
        !config.authRetryAttempted;

      if (!shouldRefresh) {
        throw error;
      }

      config.authRetryAttempted = true;

      try {
        const accessToken = await session.refresh();
        config.headers = AxiosHeaders.from(config.headers);
        config.headers.set('Authorization', `Bearer ${accessToken}`);
        return await axiosInstance.request(config);
      } catch (refreshError) {
        await session.clear();
        throw refreshError;
      }
    },
  );

  return () => {
    axiosInstance.interceptors.request.eject(requestInterceptor);
    axiosInstance.interceptors.response.eject(responseInterceptor);
  };
}
