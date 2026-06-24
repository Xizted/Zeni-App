import type { AuthSessionCoordinator } from '@/platform/network/auth-interceptors';

import type { SessionTokens, TokenVault } from './token-vault';

export type RefreshSession = (refreshToken: string) => Promise<SessionTokens>;

export class TokenRefreshCoordinator implements AuthSessionCoordinator {
  private pendingRefresh: Promise<string> | null = null;

  constructor(
    private readonly tokenVault: TokenVault,
    private readonly refreshSession: RefreshSession,
  ) {}

  clear(): Promise<void> {
    return this.tokenVault.clear();
  }

  getAccessToken(): string | null {
    return this.tokenVault.getAccessToken();
  }

  refresh(): Promise<string> {
    if (!this.pendingRefresh) {
      this.pendingRefresh = this.performRefresh().finally(() => {
        this.pendingRefresh = null;
      });
    }
    return this.pendingRefresh;
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = await this.tokenVault.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token is available.');
    }

    const tokens = await this.refreshSession(refreshToken);
    await this.tokenVault.setTokens(tokens);
    return tokens.accessToken;
  }
}
