import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuthResult } from '../auth.contracts';
import { AuthTokenService } from '../auth-token.service';
import { LoginDto } from '../dto/login.dto';
import { PasswordHasherService } from '../password-hasher.service';
import { AuthSessionService } from '../sessions/auth-session.service';

@Injectable()
export class LoginUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: AuthSessionService,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: AuthTokenService,
  ) {}

  async execute(input: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        passwordHash: true,
      },
    });
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
