import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { SessionTokens, TokenVault } from './token-vault';

const REFRESH_TOKEN_KEY = 'iris.auth.refresh-token';

export class SecureTokenVault implements TokenVault {
  private accessToken: string | null = null;
  private webRefreshToken: string | null = null;

  async clear(): Promise<void> {
    this.accessToken = null;
    this.webRefreshToken = null;
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async getRefreshToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return this.webRefreshToken;
    }
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async setTokens({ accessToken, refreshToken }: SessionTokens): Promise<void> {
    this.accessToken = accessToken;
    if (Platform.OS === 'web') {
      this.webRefreshToken = refreshToken;
      return;
    }
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  }
}
