import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthTokenService } from './auth-token.service';
import { LoginUserService } from './commands/login-user.service';
import { LogoutService } from './commands/logout.service';
import { RefreshSessionService } from './commands/refresh-session.service';
import { RegisterUserService } from './commands/register-user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PasswordHasherService } from './password-hasher.service';
import { GetCurrentUserService } from './queries/get-current-user.service';
import { AUTH_REPOSITORY } from './repositories/auth.repository';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { RedisSessionStore } from './sessions/redis-session.store';
import { SESSION_STORE } from './sessions/session.store';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthTokenService,
    PasswordHasherService,
    RegisterUserService,
    LoginUserService,
    RefreshSessionService,
    LogoutService,
    GetCurrentUserService,
    PrismaAuthRepository,
    RedisSessionStore,
    { provide: AUTH_REPOSITORY, useExisting: PrismaAuthRepository },
    { provide: SESSION_STORE, useExisting: RedisSessionStore },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
