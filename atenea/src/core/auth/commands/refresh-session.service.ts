import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  type AuthTokenPayload,
  AuthTokenService,
  type TokenPair,
} from '../auth-token.service';
import { AuthSessionService } from '../sessions/auth-session.service';

@Injectable()
export class RefreshSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: AuthSessionService,
    private readonly tokenService: AuthTokenService,
  ) {}

  async execute(refreshToken: string): Promise<TokenPair> {
    let payload: AuthTokenPayload;
    try {
      payload = await this.tokenService.verifyRefresh(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired credentials');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true },
    });
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
