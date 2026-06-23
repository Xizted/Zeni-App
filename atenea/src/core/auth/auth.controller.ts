import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import type { AuthPrincipal, AuthResult } from './auth.contracts';
import { CurrentAuth } from './auth-principal.decorator';
import type { TokenPair } from './auth-token.service';
import { LoginUserService } from './commands/login-user.service';
import { LogoutService } from './commands/logout.service';
import { RefreshSessionService } from './commands/refresh-session.service';
import { RegisterUserService } from './commands/register-user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import type { AuthUser } from './entities/auth-user.entity';
import { Public } from './public.decorator';
import { GetCurrentUserService } from './queries/get-current-user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserService,
    private readonly loginUser: LoginUserService,
    private readonly refreshSession: RefreshSessionService,
    private readonly logoutUser: LogoutService,
    private readonly getCurrentUser: GetCurrentUserService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() input: RegisterUserDto): Promise<AuthResult> {
    return this.registerUser.execute(input);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() input: LoginDto): Promise<AuthResult> {
    return this.loginUser.execute(input);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() input: RefreshSessionDto): Promise<TokenPair> {
    return this.refreshSession.execute(input.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentAuth() principal: AuthPrincipal): Promise<void> {
    return this.logoutUser.execute(principal);
  }

  @Get('me')
  me(@CurrentAuth() principal: AuthPrincipal): Promise<AuthUser> {
    return this.getCurrentUser.execute(principal.userId);
  }
}
