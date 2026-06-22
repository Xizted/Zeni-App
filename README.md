# Zeni

Zeni is an experimental monorepo for a personal finance platform. The system is divided into a client application, an API, a worker, and a PostgreSQL database.

> The project is at an early stage. Each package contains a functional scaffold, but full service integration has not been implemented yet.

## Architecture

| Project | Directory | Technology | Current status |
| --- | --- | --- | --- |
| Iris | [`iris/`](./iris) | Expo and React Native | Initial cross-platform application |
| Atenea | [`atenea/`](./atenea) | NestJS and TypeScript | Base API with an example endpoint |
| Atlas | [`atlas/`](./atlas) | Go | Minimal worker executable |
| Pluto | `docker-compose.yml` | PostgreSQL 15 | Local database |

## Requirements

- Node.js and pnpm
- Go 1.26.2 or compatible
- Docker with Docker Compose, for PostgreSQL only

## Quick Start

Clone the repository and install dependencies in each Node.js project:

```bash
cd atenea && pnpm install
cd ../iris && pnpm install
```

Start PostgreSQL from the repository root:

```bash
docker compose up -d pluto
```

Then run each service in a separate terminal:

```bash
cd atenea && pnpm start:dev
cd iris && pnpm start
cd atlas && go run .
```

The Compose file also declares Atenea and Atlas, but those services do not yet include the required `Dockerfile` files. For now, only `pluto` should be started through Docker.

## Verification

Run the relevant command from the repository root:

```bash
cd atenea && pnpm test
cd atenea && pnpm lint
cd iris && pnpm lint
cd atlas && go test ./...
```

Read [AGENTS.md](./AGENTS.md) before contributing. It documents the repository structure, conventions, testing practices, and pull request requirements.

## License

This is a personal project for education and technical experimentation. No distribution license has been defined for the monorepo.
