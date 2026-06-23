import {
  ConflictException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AuthResult } from '../auth.contracts';
import { AuthTokenService } from '../auth-token.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import type { AuthUser } from '../entities/auth-user.entity';
import { PasswordHasherService } from '../password-hasher.service';
import {
  AUTH_REPOSITORY,
  EmailAlreadyRegisteredError,
} from '../repositories/auth.repository';
import type { AuthRepository } from '../repositories/auth.repository';
import { SESSION_STORE } from '../sessions/session.store';
import type { SessionStore } from '../sessions/session.store';

@Injectable()
export class RegisterUserService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly users: AuthRepository,
    @Inject(SESSION_STORE) private readonly sessions: SessionStore,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: AuthTokenService,
  ) {}

  async execute(input: RegisterUserDto): Promise<AuthResult> {
    const passwordHash = await this.passwordHasher.hash(input.password);
    let user: AuthUser;
    try {
      user = await this.users.create({
        email: input.email,
        fullName: input.fullName,
        passwordHash,
      });
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }

    try {
      const sessionId = randomUUID();
      const tokens = await this.tokenService.issue(user.id, sessionId);
      await this.sessions.replace(user.id, {
        sessionId,
        refreshTokenDigest: this.tokenService.digest(tokens.refreshToken),
      });
      return { user, tokens };
    } catch {
      await this.compensate(user.id);
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
  }

  private async compensate(userId: string): Promise<void> {
    try {
      await this.users.deleteNewUser(userId);
    } catch {
      // Preserve the original infrastructure failure without exposing details.
    }
  }
}
