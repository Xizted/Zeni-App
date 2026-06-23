import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuthResult } from '../auth.contracts';
import { AuthTokenService } from '../auth-token.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import type { AuthUser } from '../entities/auth-user.entity';
import { PasswordHasherService } from '../password-hasher.service';
import { AuthSessionService } from '../sessions/auth-session.service';

@Injectable()
export class RegisterUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: AuthSessionService,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: AuthTokenService,
  ) {}

  async execute(input: RegisterUserDto): Promise<AuthResult> {
    const passwordHash = await this.passwordHasher.hash(input.password);
    let user: AuthUser;
    try {
      user = await this.prisma.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
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
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
  }
}
