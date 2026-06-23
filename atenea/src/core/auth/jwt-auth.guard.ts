import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthPrincipal } from './auth.contracts';
import { type AuthTokenPayload, AuthTokenService } from './auth-token.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { SESSION_STORE } from './sessions/session.store';
import type { AuthSession, SessionStore } from './sessions/session.store';

interface AuthenticatedRequest extends Request {
  auth?: AuthPrincipal;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: AuthTokenService,
    @Inject(SESSION_STORE) private readonly sessions: SessionStore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.bearerToken(request);
    let payload: AuthTokenPayload;
    try {
      payload = await this.tokenService.verifyAccess(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired credentials');
    }

    let session: AuthSession | null;
    try {
      session = await this.sessions.find(payload.sub);
    } catch {
      throw new ServiceUnavailableException('Authentication is unavailable');
    }
    if (session?.sessionId !== payload.sid) {
      throw new UnauthorizedException('Invalid or expired credentials');
    }

    request.auth = { userId: payload.sub, sessionId: payload.sid };
    return true;
  }

  private bearerToken(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid or expired credentials');
    }
    return token;
  }
}
