import {
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AuthResult } from '../auth.contracts';
import { AuthTokenService } from '../auth-token.service';
import { LoginDto } from '../dto/login.dto';
import { PasswordHasherService } from '../password-hasher.service';
import { AUTH_REPOSITORY } from '../repositories/auth.repository';
import type { AuthRepository } from '../repositories/auth.repository';
import { SESSION_STORE } from '../sessions/session.store';
import type { SessionStore } from '../sessions/session.store';

@Injectable()
export class LoginUserService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly users: AuthRepository,
    @Inject(SESSION_STORE) private readonly sessions: SessionStore,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: AuthTokenService,
  ) {}

  async execute(input: LoginDto): Promise<AuthResult> {
    const user = await this.users.findActiveByEmail(input.email);
    if (!user) {
      await this.passwordHasher.verifyDummy(input.password);
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await this.passwordHasher.verify(
      user.passwordHash,
      input.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionId = randomUUID();
    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
    };
    try {
      const tokens = await this.tokenService.issue(user.id, sessionId);
      await this.sessions.replace(user.id, {
        sessionId,
        refreshTokenDigest: this.tokenService.digest(tokens.refreshToken),
      });
      return { user: safeUser, tokens };
    } catch {
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
  }
}
