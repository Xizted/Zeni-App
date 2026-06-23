import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';
import { Environment } from '../config/environment';

export interface AuthTokenPayload {
  sub: string;
  sid: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthTokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: number;
  private readonly refreshTtl: number;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService<Environment, true>,
  ) {
    this.accessSecret = configService.get('JWT_ACCESS_SECRET', { infer: true });
    this.refreshSecret = configService.get('JWT_REFRESH_SECRET', {
      infer: true,
    });
    this.accessTtl = configService.get('JWT_ACCESS_TTL_SECONDS', {
      infer: true,
    });
    this.refreshTtl = configService.get('JWT_REFRESH_TTL_SECONDS', {
      infer: true,
    });
  }

  async issue(userId: string, sessionId: string): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, sid: sessionId, type: 'access' },
        {
          secret: this.accessSecret,
          expiresIn: this.accessTtl,
          jwtid: randomUUID(),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, sid: sessionId, type: 'refresh' },
        {
          secret: this.refreshSecret,
          expiresIn: this.refreshTtl,
          jwtid: randomUUID(),
        },
      ),
    ]);
    return { accessToken, refreshToken, expiresIn: this.accessTtl };
  }

  async verifyAccess(token: string): Promise<AuthTokenPayload> {
    return this.verify(token, this.accessSecret, 'access');
  }

  async verifyRefresh(token: string): Promise<AuthTokenPayload> {
    return this.verify(token, this.refreshSecret, 'refresh');
  }

  digest(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async verify(
    token: string,
    secret: string,
    type: AuthTokenPayload['type'],
  ): Promise<AuthTokenPayload> {
    const payload = await this.jwtService.verifyAsync<
      Partial<AuthTokenPayload>
    >(token, { secret });
    if (
      payload.type !== type ||
      typeof payload.sub !== 'string' ||
      typeof payload.sid !== 'string'
    ) {
      throw new Error('Invalid token payload');
    }
    return payload as AuthTokenPayload;
  }
}
