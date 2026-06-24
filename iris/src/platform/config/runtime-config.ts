import { Platform } from 'react-native';

export interface RuntimeConfig {
  apiBaseUrl: string;
}

const developmentApiUrl = Platform.select({
  android: 'http://10.0.2.2:3000/api/v1',
  default: 'http://localhost:3000/api/v1',
});

export function getRuntimeConfig(
  apiUrl = process.env.EXPO_PUBLIC_ATENEA_API_URL ?? developmentApiUrl,
): RuntimeConfig {
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_ATENEA_API_URL is required.');
  }

  const parsedUrl = new URL(apiUrl);
  if (!__DEV__ && parsedUrl.protocol !== 'https:') {
    throw new Error('Atenea must use HTTPS outside development.');
  }

  return { apiBaseUrl: apiUrl.replace(/\/$/, '') };
}
