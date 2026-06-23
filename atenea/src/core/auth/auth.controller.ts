import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto';
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
import {
  AuthResultEnvelopeDto,
  AuthUserEnvelopeDto,
  TokenPairEnvelopeDto,
} from './dto/auth-response.dto';
import type { AuthUser } from './entities/auth-user.entity';
import { Public } from './public.decorator';
import { GetCurrentUserService } from './queries/get-current-user.service';

@ApiTags('auth')
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
  @ApiOperation({ summary: 'Register a user and create a session' })
  @ApiCreatedResponse({ type: AuthResultEnvelopeDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  register(@Body() input: RegisterUserDto): Promise<AuthResult> {
    return this.registerUser.execute(input);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiOkResponse({ type: AuthResultEnvelopeDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  login(@Body() input: LoginDto): Promise<AuthResult> {
    return this.loginUser.execute(input);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate a refresh token' })
  @ApiOkResponse({ type: TokenPairEnvelopeDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  refresh(@Body() input: RefreshSessionDto): Promise<TokenPair> {
    return this.refreshSession.execute(input.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Revoke the current session' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  logout(@CurrentAuth() principal: AuthPrincipal): Promise<void> {
    return this.logoutUser.execute(principal);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiOkResponse({ type: AuthUserEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  me(@CurrentAuth() principal: AuthPrincipal): Promise<AuthUser> {
    return this.getCurrentUser.execute(principal.userId);
  }
}
