import { TokenRefreshCoordinator } from './token-refresh-coordinator';
import type { SessionTokens, TokenVault } from './token-vault';

function createVault(refreshToken = 'refresh-token'): TokenVault & { tokens: SessionTokens | null } {
  return {
    tokens: null,
    clear: jest.fn(async () => undefined),
    getAccessToken: jest.fn(() => null),
    getRefreshToken: jest.fn(async () => refreshToken),
    setTokens: jest.fn(async function (
      this: { tokens: SessionTokens | null },
      tokens: SessionTokens,
    ) {
      this.tokens = tokens;
    }),
  };
}

describe('TokenRefreshCoordinator', () => {
  it('shares one refresh operation across concurrent requests', async () => {
    const vault = createVault();
    const refreshSession = jest.fn(async () => ({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    }));
    const coordinator = new TokenRefreshCoordinator(vault, refreshSession);

    const [first, second] = await Promise.all([coordinator.refresh(), coordinator.refresh()]);

    expect(first).toBe('new-access-token');
    expect(second).toBe('new-access-token');
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(vault.setTokens).toHaveBeenCalledTimes(1);
  });
});
