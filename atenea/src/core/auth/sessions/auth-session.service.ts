import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../cache/redis.service';
import { Environment } from '../../config/environment';

export interface AuthSession {
  sessionId: string;
  refreshTokenDigest: string;
}

const ROTATE_SCRIPT = `
local current = redis.call('GET', KEYS[1])
if not current then return 0 end
local session = cjson.decode(current)
if session.sessionId ~= ARGV[1] or session.refreshTokenDigest ~= ARGV[2] then
  return 0
end
session.refreshTokenDigest = ARGV[3]
redis.call('SET', KEYS[1], cjson.encode(session), 'EX', ARGV[4])
return 1
`;

const REVOKE_SCRIPT = `
local current = redis.call('GET', KEYS[1])
if not current then return 0 end
local session = cjson.decode(current)
if session.sessionId ~= ARGV[1] then return 0 end
redis.call('DEL', KEYS[1])
return 1
`;

@Injectable()
export class AuthSessionService {
  private readonly ttlSeconds: number;

  constructor(
    private readonly redis: RedisService,
    configService: ConfigService<Environment, true>,
  ) {
    this.ttlSeconds = configService.get('JWT_REFRESH_TTL_SECONDS', {
      infer: true,
    });
  }

  async replace(userId: string, session: AuthSession): Promise<void> {
    await this.redis.setWithExpiration(
      this.key(userId),
      JSON.stringify(session),
      this.ttlSeconds,
    );
  }

  async find(userId: string): Promise<AuthSession | null> {
    const value = await this.redis.get(this.key(userId));
    if (value === null) {
      return null;
    }

    try {
      const session = JSON.parse(value) as Partial<AuthSession>;
      if (
        typeof session.sessionId !== 'string' ||
        typeof session.refreshTokenDigest !== 'string'
      ) {
        await this.redis.del(this.key(userId));
        return null;
      }
      return session as AuthSession;
    } catch {
      await this.redis.del(this.key(userId));
      return null;
    }
  }

  async rotate(
    userId: string,
    sessionId: string,
    currentDigest: string,
    nextDigest: string,
  ): Promise<boolean> {
    const result = await this.redis.eval(
      ROTATE_SCRIPT,
      [this.key(userId)],
      [sessionId, currentDigest, nextDigest, String(this.ttlSeconds)],
    );
    return result === 1;
  }

  async revoke(userId: string, sessionId: string): Promise<boolean> {
    const result = await this.redis.eval(
      REVOKE_SCRIPT,
      [this.key(userId)],
      [sessionId],
    );
    return result === 1;
  }

  private key(userId: string): string {
    return `auth:session:${userId}`;
  }
}
