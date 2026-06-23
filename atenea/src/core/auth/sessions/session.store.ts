export const SESSION_STORE = Symbol('SESSION_STORE');

export interface AuthSession {
  sessionId: string;
  refreshTokenDigest: string;
}

export interface SessionStore {
  replace(userId: string, session: AuthSession): Promise<void>;
  find(userId: string): Promise<AuthSession | null>;
  rotate(
    userId: string,
    sessionId: string,
    currentDigest: string,
    nextDigest: string,
  ): Promise<boolean>;
  revoke(userId: string, sessionId: string): Promise<boolean>;
}
