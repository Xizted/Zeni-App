import { ConflictException, ServiceUnavailableException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuthTokenService } from '../auth-token.service';
import { PasswordHasherService } from '../password-hasher.service';
import { AuthSessionService } from '../sessions/auth-session.service';
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

  let createUser: jest.Mock;
  let sessions: jest.Mocked<Pick<AuthSessionService, 'replace'>>;
  let service: RegisterUserService;

  beforeEach(() => {
    createUser = jest.fn().mockResolvedValue(user);
    const prisma = {
      user: { create: createUser },
    } as unknown as PrismaService;
    sessions = {
      replace: jest.fn().mockResolvedValue(undefined),
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
      prisma,
      sessions as unknown as AuthSessionService,
      passwordHasher,
      tokenService,
    );
  });

  it('preserves the new user when session creation fails', async () => {
    sessions.replace.mockRejectedValue(new Error('Redis unavailable'));

    await expect(service.execute(input)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(createUser).toHaveBeenCalledTimes(1);
  });

  it('maps a duplicate email to conflict without creating a session', async () => {
    createUser.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.8.0',
      }),
    );

    await expect(service.execute(input)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(sessions.replace).not.toHaveBeenCalled();
  });
});
