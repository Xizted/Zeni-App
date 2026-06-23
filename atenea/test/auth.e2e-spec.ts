import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/app.config';
import type {
  AuthUser,
  AuthUserWithPassword,
} from '../src/core/auth/entities/auth-user.entity';
import {
  AUTH_REPOSITORY,
  AuthRepository,
  CreateAuthUserInput,
  EmailAlreadyRegisteredError,
} from '../src/core/auth/repositories/auth.repository';
import {
  AuthSession,
  SESSION_STORE,
  SessionStore,
} from '../src/core/auth/sessions/session.store';
import { RedisService } from '../src/core/cache/redis.service';
import { PrismaService } from '../src/core/database/prisma.service';

class InMemoryAuthRepository implements AuthRepository {
  private readonly users = new Map<string, AuthUserWithPassword>();

  async create(input: CreateAuthUserInput): Promise<AuthUser> {
    if ([...this.users.values()].some((user) => user.email === input.email)) {
      throw new EmailAlreadyRegisteredError();
    }
    const user: AuthUserWithPassword = {
      id: crypto.randomUUID(),
      email: input.email,
      fullName: input.fullName,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return this.safeUser(user);
  }

  async findActiveByEmail(email: string): Promise<AuthUserWithPassword | null> {
    return (
      [...this.users.values()].find((user) => user.email === email) ?? null
    );
  }

  async findActiveById(id: string): Promise<AuthUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    return this.safeUser(user);
  }

  async deleteNewUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  private safeUser(user: AuthUserWithPassword): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
    };
  }
}

class InMemorySessionStore implements SessionStore {
  private readonly sessions = new Map<string, AuthSession>();

  async replace(userId: string, session: AuthSession): Promise<void> {
    this.sessions.set(userId, session);
  }

  async find(userId: string): Promise<AuthSession | null> {
    return this.sessions.get(userId) ?? null;
  }

  async rotate(
    userId: string,
    sessionId: string,
    currentDigest: string,
    nextDigest: string,
  ): Promise<boolean> {
    const session = this.sessions.get(userId);
    if (
      session?.sessionId !== sessionId ||
      session.refreshTokenDigest !== currentDigest
    ) {
      return false;
    }
    this.sessions.set(userId, {
      sessionId,
      refreshTokenDigest: nextDigest,
    });
    return true;
  }

  async revoke(userId: string, sessionId: string): Promise<boolean> {
    const session = this.sessions.get(userId);
    if (session?.sessionId !== sessionId) return false;
    return this.sessions.delete(userId);
  }
}

describe('Authentication (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
      .overrideProvider(RedisService)
      .useValue({})
      .overrideProvider(AUTH_REPOSITORY)
      .useValue(new InMemoryAuthRepository())
      .overrideProvider(SESSION_STORE)
      .useValue(new InMemorySessionStore())
      .compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
  });

  it('registers, authenticates, rotates, replaces and revokes one session', async () => {
    const registration = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: '  USER@Example.com ',
        password: 'a-secure-password',
        fullName: '  Zeni User  ',
      })
      .expect(201);

    expect(registration.body.data.user).toMatchObject({
      email: 'user@example.com',
      fullName: 'Zeni User',
    });
    expect(registration.body.data.user).not.toHaveProperty('passwordHash');
    const firstAccessToken = registration.body.data.tokens
      .accessToken as string;

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .expect(200);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'a-secure-password' })
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .expect(401);

    const loginAccessToken = login.body.data.tokens.accessToken as string;
    const refreshToken = login.body.data.tokens.refreshToken as string;
    const refreshed = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${loginAccessToken}`)
      .expect(204);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set(
        'Authorization',
        `Bearer ${refreshed.body.data.accessToken as string}`,
      )
      .expect(401);
  });

  it('rejects invalid and non-whitelisted registration input', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'invalid',
        password: 'short',
        fullName: 'A',
        role: 'admin',
      })
      .expect(400);

    expect(response.body.error.message).toEqual(
      expect.arrayContaining([
        'property role should not exist',
        'email must be an email',
      ]),
    );
  });

  it('returns the same unauthorized contract for unknown and wrong credentials', async () => {
    const passwordHash = await argon2.hash('a-secure-password');
    expect(passwordHash).toContain('$argon2');

    const unknown = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'missing@example.com', password: 'a-secure-password' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'user@example.com',
        password: 'a-secure-password',
        fullName: 'Zeni User',
      })
      .expect(201);
    const wrong = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'wrong-password-value' })
      .expect(401);

    expect(unknown.body.error.message).toBe('Invalid email or password');
    expect(wrong.body.error.message).toBe('Invalid email or password');
  });

  afterEach(async () => {
    await app.close();
  });
});
