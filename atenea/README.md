# Atenea

Atenea is the Zeni API, built with NestJS and TypeScript. It currently contains the initial NestJS scaffold, a `GET /` endpoint, and example unit and end-to-end tests.

## Requirements

- Node.js
- pnpm

## Local Development

Install dependencies and start the server with automatic reload:

```bash
pnpm install
pnpm start:dev
```

The API is available at `http://localhost:3000`.

## Commands

| Command | Description |
| --- | --- |
| `pnpm start:dev` | Starts NestJS in watch mode |
| `pnpm test` | Runs unit tests with Jest |
| `pnpm test:e2e` | Runs end-to-end tests |
| `pnpm test:cov` | Generates a coverage report |
| `pnpm lint` | Checks and fixes TypeScript files with ESLint |
| `pnpm format` | Formats `src/` and `test/` with Prettier |

## Structure

```text
src/                  Application code and unit tests
test/                 End-to-end tests and Jest configuration
eslint.config.mjs     ESLint and Prettier rules
```

Name unit tests `*.spec.ts` and end-to-end tests `*.e2e-spec.ts`. PostgreSQL integration, authentication, Prisma, and gRPC communication have not been implemented yet. Add their setup instructions only when a verifiable implementation exists.
