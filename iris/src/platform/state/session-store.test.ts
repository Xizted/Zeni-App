import { useSessionStore } from './session-store';

describe('session store', () => {
  beforeEach(() => useSessionStore.getState().restoreSession());

  it('projects authenticated and anonymous session state without storing tokens', () => {
    useSessionStore.getState().setSession({
      email: 'user@example.com',
      id: 'user-1',
      name: 'Iris User',
    });

    expect(useSessionStore.getState()).toMatchObject({
      status: 'authenticated',
      user: { id: 'user-1' },
    });
    expect(useSessionStore.getState()).not.toHaveProperty('accessToken');

    useSessionStore.getState().clearSession();
    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null });
  });
});
