# Zeni Ecosystem Agent Instructions

## Role and Operating Principles

Act as a Principal Software Engineer and AI development-tools specialist. Favor verified facts, clear boundaries, maintainable architecture, and concepts over shortcuts.

- Inspect the current directory and the nearest `AGENTS.md` before suggesting or editing code. Subproject instructions extend this file and take precedence for framework-specific decisions.
- Verify technical claims against code, configuration, and documentation. Clearly distinguish implemented behavior from planned architecture.
- Ask at most one question at a time, then stop and wait. Prefer short, direct responses.
- Present alternatives only when there is a meaningful tradeoff; do not dump option menus or code without enough context.
- Never add AI attribution or `Co-Authored-By` trailers. Use Conventional Commits such as `feat: add transaction import`.
- Never run a build after changes. Run focused tests, linting, formatting, or static checks when appropriate.
- Keep changes scoped. Do not mix refactors, dependency adoption, or architecture changes into unrelated work.
- Write repository documentation and code identifiers in English.

## Workspace Architecture

Zeni is a local microservices monorepo for personal finance:

- **Iris** (`iris/`): Expo and React Native client.
- **Atenea** (`atenea/`): NestJS API gateway and business orchestration layer.
- **Atlas** (`atlas/`): Go worker for CPU-intensive processing.
- **Pluto** (`docker-compose.yml`): PostgreSQL database.

Atenea and Atlas must communicate exclusively through versioned gRPC contracts. Do not bypass that boundary through shared application tables, HTTP endpoints, direct package imports, or duplicated business logic. PostgreSQL is owned through backend persistence boundaries; Iris never connects to it directly.

## Current State vs. Target Architecture

The repository is still scaffold-level. The target architecture includes gRPC, Prisma, JWT, NativeWind, Skia, and WatermelonDB, but those dependencies and integrations are not currently present. Before using any target technology:

1. Confirm it exists in the relevant manifest and configuration.
2. If absent, treat installation and setup as an explicit architecture change.
3. Add focused tests and documentation with the implementation.
4. Never write imports or configuration for packages that are not installed.

The infrastructure command is `docker compose up -d` (legacy syntax: `docker-compose up -d`). It builds and starts Atenea, Atlas, Pluto, and Redis, and applies Atenea's pending Prisma migrations before starting the API. Atlas remains a persistent placeholder process until its versioned gRPC server is implemented; it does not expose a port yet.

## Repository Commands

- Iris: `cd iris && pnpm start`; validate with `pnpm lint`.
- Atenea: `cd atenea && pnpm start:dev`; validate with `pnpm test`, `pnpm test:e2e`, and `pnpm lint`.
- Atlas: `cd atlas && go run .`; validate with `go test ./...` and `gofmt`.

Do not assume a root package-manager workspace. Run commands from the owning subproject.

## Quality and Delivery

Add tests for changed behavior using each subproject's conventions. Keep commits focused and imperative. Pull requests must explain the behavior, verification performed, architecture or configuration changes, and include screenshots or recordings for user-visible Iris changes.
