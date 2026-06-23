import { AuthUser } from './entities/auth-user.entity';
import { TokenPair } from './auth-token.service';

export interface AuthResult {
  user: AuthUser;
  tokens: TokenPair;
}

export interface AuthPrincipal {
  userId: string;
  sessionId: string;
}
