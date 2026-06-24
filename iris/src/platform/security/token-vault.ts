export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenVault {
  clear(): Promise<void>;
  getAccessToken(): string | null;
  getRefreshToken(): Promise<string | null>;
  setTokens(tokens: SessionTokens): Promise<void>;
}
