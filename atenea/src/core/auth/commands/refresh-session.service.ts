import {
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  type AuthTokenPayload,
  AuthTokenService,
  type TokenPair,
} from '../auth-token.service';
import { AUTH_REPOSITORY } from '../repositories/auth.repository';
import type { AuthRepository } from '../repositories/auth.repository';
import { SESSION_STORE } from '../sessions/session.store';
import type { SessionStore } from '../sessions/session.store';

@Injectable()
export class RefreshSessionService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly users: AuthRepository,
    @Inject(SESSION_STORE) private readonly sessions: SessionStore,
    private readonly tokenService: AuthTokenService,
  ) {}

  async execute(refreshToken: string): Promise<TokenPair> {
    let payload: AuthTokenPayload;
    try {
      payload = await this.tokenService.verifyRefresh(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired credentials');
    }

    const user = await this.users.findActiveById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired credentials');
    }

    const tokens = await this.tokenService.issue(payload.sub, payload.sid);
    try {
      const rotated = await this.sessions.rotate(
        payload.sub,
        payload.sid,
        this.tokenService.digest(refreshToken),
        this.tokenService.digest(tokens.refreshToken),
      );
      if (!rotated) {
        throw new UnauthorizedException('Invalid or expired credentials');
      }
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
  }
}
