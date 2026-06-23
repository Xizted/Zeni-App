import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { AuthPrincipal } from '../auth.contracts';
import { AuthSessionService } from '../sessions/auth-session.service';

@Injectable()
export class LogoutService {
  constructor(private readonly sessions: AuthSessionService) {}

  async execute(principal: AuthPrincipal): Promise<void> {
    try {
      await this.sessions.revoke(principal.userId, principal.sessionId);
    } catch {
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
  }
}
