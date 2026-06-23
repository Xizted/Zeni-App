import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { AuthPrincipal } from '../auth.contracts';
import { SESSION_STORE } from '../sessions/session.store';
import type { SessionStore } from '../sessions/session.store';

@Injectable()
export class LogoutService {
  constructor(@Inject(SESSION_STORE) private readonly sessions: SessionStore) {}

  async execute(principal: AuthPrincipal): Promise<void> {
    try {
      await this.sessions.revoke(principal.userId, principal.sessionId);
    } catch {
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
  }
}
