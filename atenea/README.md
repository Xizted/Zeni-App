# Atenea

Atenea is the Zeni API gateway and business orchestration service, built with NestJS and TypeScript. Authentication uses PostgreSQL for users and Redis as the canonical store for one active session per user.

## Requirements

- Node.js
- pnpm
- Docker with Compose

## Local Development

Start PostgreSQL and Redis from the ecosystem root:

```bash
docker compose up -d pluto redis
```

PostgreSQL and Redis are exposed only on the host loopback interface, using ports `5433` and `6380` by default. Override them with `POSTGRES_HOST_PORT` and `REDIS_HOST_PORT` when needed.

Create the local configuration and replace both JWT secrets with independent values of at least 32 characters:

```bash
cp .env.example .env
```

Install dependencies, apply migrations, generate Prisma Client, and start the server:

```bash
pnpm install
pnpm prisma:migrate
pnpm prisma:generate
pnpm start:dev
```

NestJS starts in watch mode and reloads after source changes. The local endpoints are:

| Resource        | URL                                      |
| --------------- | ---------------------------------------- |
| Versioned API   | `http://localhost:3000/api/v1`           |
| Swagger UI      | `http://localhost:3000/api/docs`         |
| OpenAPI JSON    | `http://localhost:3000/api/docs-json`    |
| Liveness probe  | `http://localhost:3000/api/health/live`  |
| Readiness probe | `http://localhost:3000/api/health/ready` |

Swagger is enabled in development and test environments. It is not exposed when `NODE_ENV=production`.

## Docker Compose

From the ecosystem root, build and start the complete backend stack:

```bash
docker compose up -d
```

Compose applies pending Prisma migrations before starting Atenea and waits for PostgreSQL and Redis to become healthy. The tracked `.env.example` provides development defaults; create `atenea/.env` to override JWT configuration locally. Never use the example secrets outside local development.

## Authentication

| Method | Endpoint                | Access       |
| ------ | ----------------------- | ------------ |
| `POST` | `/api/v1/auth/register` | Public       |
| `POST` | `/api/v1/auth/login`    | Public       |
| `POST` | `/api/v1/auth/refresh`  | Public       |
| `POST` | `/api/v1/auth/logout`   | Bearer token |
| `GET`  | `/api/v1/auth/me`       | Bearer token |

Access tokens expire after 15 minutes by default. Refresh tokens expire after 30 days, rotate on every refresh, and are represented in Redis only by a SHA-256 digest. A new login replaces the previous session immediately.

## API Documentation

Swagger documents the versioned authentication API, validation schemas, response envelopes, errors, health checks, and JWT security requirements.

Open `http://localhost:3000/api/docs`, select **Authorize**, and enter the access token returned by register or login. Swagger applies it as a Bearer token to protected operations. The machine-readable OpenAPI document is available at `http://localhost:3000/api/docs-json`.

## Health Checks

Health endpoints are public and intentionally excluded from URI versioning so infrastructure probes remain stable.

| Method | Endpoint            | Purpose                                                           |
| ------ | ------------------- | ----------------------------------------------------------------- |
| `GET`  | `/api/health/live`  | Confirms that the Atenea process can answer HTTP requests.        |
| `GET`  | `/api/health/ready` | Checks PostgreSQL and Redis before accepting application traffic. |

Dependency checks time out after one second. A healthy probe returns HTTP `200` inside the standard `{ "data": ... }` response envelope. Failed readiness returns HTTP `503` inside the standard error envelope and identifies each dependency as `up` or `down`, without exposing connection details.

```bash
curl http://localhost:3000/api/health/live
curl http://localhost:3000/api/health/ready
```

Docker Compose uses the readiness endpoint for Atenea's container health check. If readiness returns `503` during local development, verify the dependencies from the ecosystem root:

```bash
docker compose ps pluto redis
docker compose up -d pluto redis
```

By default, Atenea connects to PostgreSQL on `localhost:5433` and Redis on `localhost:6380`, as configured in `.env.example`.

## Commands

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `pnpm start:dev`       | Starts NestJS in watch mode                   |
| `pnpm prisma:migrate`  | Creates and applies development migrations    |
| `pnpm prisma:generate` | Generates Prisma Client                       |
| `pnpm test`            | Runs unit tests with Jest                     |
| `pnpm test:e2e`        | Runs end-to-end tests                         |
| `pnpm test:cov`        | Generates a coverage report                   |
| `pnpm lint`            | Checks and fixes TypeScript files with ESLint |
| `pnpm format`          | Formats `src/` and `test/` with Prettier      |

## Structure

```text
src/core/auth/        Authentication use cases, guards, and session boundary
src/core/cache/       Redis lifecycle and access
src/core/database/    Prisma lifecycle and access
src/core/health/      Liveness, readiness, and dependency indicators
src/common/           Global HTTP response and error handling
test/                 End-to-end tests and Jest configuration
```

Name unit tests `*.spec.ts` and end-to-end tests `*.e2e-spec.ts`. Redis failures fail authentication closed; JWTs are never accepted without a matching active session.
