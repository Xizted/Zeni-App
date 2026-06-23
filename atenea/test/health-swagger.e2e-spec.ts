import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/app.config';
import { RedisService } from '../src/core/cache/redis.service';
import { PrismaService } from '../src/core/database/prisma.service';
import { configureSwagger } from '../src/swagger.config';

interface TestContext {
  app: INestApplication<App>;
  databasePing: jest.Mock;
  redisPing: jest.Mock;
}

const createTestApp = async (
  nodeEnvironment = 'test',
): Promise<TestContext> => {
  const databasePing = jest.fn().mockResolvedValue(undefined);
  const documentDatabasePing = jest
    .fn()
    .mockRejectedValue(new Error('Use the mongodb provider'));
  const redisPing = jest.fn().mockResolvedValue(undefined);
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({
      $runCommandRaw: documentDatabasePing,
      $queryRawUnsafe: databasePing,
    })
    .overrideProvider(RedisService)
    .useValue({ ping: redisPing })
    .compile();
  const app = moduleFixture.createNestApplication();
  configureApplication(app);
  configureSwagger(app, nodeEnvironment);
  await app.init();
  return { app, databasePing, redisPing };
};

describe('Health checks and Swagger (e2e)', () => {
  let context: TestContext | undefined;

  afterEach(async () => {
    await context?.app.close();
    context = undefined;
  });

  it('exposes public, unversioned liveness and readiness probes', async () => {
    context = await createTestApp();

    const liveness = await request(context.app.getHttpServer())
      .get('/api/health/live')
      .expect(200);
    expect(liveness.body.data).toMatchObject({
      status: 'ok',
      details: { api: { status: 'up' } },
    });

    const readiness = await request(context.app.getHttpServer())
      .get('/api/health/ready')
      .expect(200);
    expect(readiness.body.data).toMatchObject({
      status: 'ok',
      details: {
        database: { status: 'up' },
        redis: { status: 'up' },
      },
    });
    expect(context.databasePing).toHaveBeenCalledTimes(1);
    expect(context.redisPing).toHaveBeenCalledTimes(1);
  });

  it('returns the standard error contract when readiness fails', async () => {
    context = await createTestApp();
    context.databasePing.mockRejectedValueOnce(new Error('database offline'));

    const response = await request(context.app.getHttpServer())
      .get('/api/health/ready')
      .expect(503);

    expect(response.body.error).toEqual({
      statusCode: 503,
      code: 'SERVICE_UNAVAILABLE',
      message: 'Service Unavailable Exception',
      path: '/api/health/ready',
      timestamp: expect.any(String),
    });
    expect(response.body.error).not.toHaveProperty('details');
  });

  it('publishes the OpenAPI contract outside production', async () => {
    context = await createTestApp();

    await request(context.app.getHttpServer()).get('/api/docs').expect(200);
    const response = await request(context.app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    expect(response.body.info).toMatchObject({
      title: 'Atenea API',
      version: '1.0',
    });
    expect(response.body.paths).toHaveProperty('/api/health/live');
    expect(response.body.paths).toHaveProperty('/api/health/ready');
    expect(response.body.paths).toHaveProperty('/api/v1/auth/login');
    expect(response.body.components.securitySchemes).toHaveProperty(
      'access-token',
    );
    expect(response.body.components.schemas.LoginDto.properties).toHaveProperty(
      'email',
    );
  });

  it('does not expose Swagger in production', async () => {
    context = await createTestApp('production');

    await request(context.app.getHttpServer())
      .get('/api/docs-json')
      .expect(404);
  });
});
