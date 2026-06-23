import { AuthUser, AuthUserWithPassword } from '../entities/auth-user.entity';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface CreateAuthUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
}

export interface AuthRepository {
  create(input: CreateAuthUserInput): Promise<AuthUser>;
  findActiveByEmail(email: string): Promise<AuthUserWithPassword | null>;
  findActiveById(id: string): Promise<AuthUser | null>;
  deleteNewUser(id: string): Promise<void>;
}

export class EmailAlreadyRegisteredError extends Error {}
