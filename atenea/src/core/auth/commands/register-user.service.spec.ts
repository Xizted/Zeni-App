import { ConflictException, ServiceUnavailableException } from '@nestjs/common';
import { AuthTokenService } from '../auth-token.service';
import { PasswordHasherService } from '../password-hasher.service';
import {
  AuthRepository,
  EmailAlreadyRegisteredError,
} from '../repositories/auth.repository';
import { SessionStore } from '../sessions/session.store';
import { RegisterUserService } from './register-user.service';

describe('RegisterUserService', () => {
  const input = {
    email: 'user@example.com',
    password: 'a-secure-password',
    fullName: 'Zeni User',
  };
  const user = {
    id: 'user-id',
    email: input.email,
    fullName: input.fullName,
    createdAt: new Date(),
  };

  let users: jest.Mocked<AuthRepository>;
  let sessions: jest.Mocked<SessionStore>;
  let service: RegisterUserService;

  beforeEach(() => {
    users = {
      create: jest.fn().mockResolvedValue(user),
      findActiveByEmail: jest.fn(),
      findActiveById: jest.fn(),
      deleteNewUser: jest.fn().mockResolvedValue(undefined),
    };
    sessions = {
      replace: jest.fn().mockResolvedValue(undefined),
      find: jest.fn(),
      rotate: jest.fn(),
      revoke: jest.fn(),
    };
    const passwordHasher = {
      hash: jest.fn().mockResolvedValue('password-hash'),
    } as unknown as PasswordHasherService;
    const tokenService = {
      issue: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
      }),
      digest: jest.fn().mockReturnValue('refresh-digest'),
    } as unknown as AuthTokenService;

    service = new RegisterUserService(
      users,
      sessions,
      passwordHasher,
      tokenService,
    );
  });

  it('removes the new user when session creation fails', async () => {
    sessions.replace.mockRejectedValue(new Error('Redis unavailable'));

    await expect(service.execute(input)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(users.deleteNewUser).toHaveBeenCalledWith(user.id);
  });

  it('maps a duplicate email to conflict without creating a session', async () => {
    users.create.mockRejectedValue(new EmailAlreadyRegisteredError());

    await expect(service.execute(input)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(sessions.replace).not.toHaveBeenCalled();
  });
});
