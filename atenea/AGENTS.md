# Atenea Agent Instructions

These instructions extend the root [`AGENTS.md`](../AGENTS.md). Apply them to all work under `atenea/`.

## Context

Atenea is Zeni's NestJS API gateway and orchestration layer. The current project contains the base NestJS scaffold. Prisma, PostgreSQL integration, `class-validator`, `class-transformer`, JWT, and gRPC are target technologies but are not installed or configured yet. Do not import or claim support for them until the required dependency and configuration change is implemented.

## NestJS Architecture

- Preserve NestJS module boundaries: modules compose capabilities, controllers adapt transport input, and services implement application behavior.
- Keep controllers thin. They must not contain persistence queries, business rules, or cross-service orchestration details.
- Organize capabilities by domain module instead of creating global folders grouped only by technical type.
- Use dependency injection; do not instantiate services, repositories, or clients manually.
- Type every public service return value explicitly. Do not leak Prisma-generated models across application boundaries when a domain or response type is appropriate.

## Inputs and Transport

All external input must use dedicated DTO classes with strict `class-validator` rules and `class-transformer` where transformation is required. Enable and preserve a global validation pipe with whitelisting and rejection of unknown properties once those packages are introduced. Never reuse persistence models as request DTOs.

Atenea and Atlas communicate exclusively through versioned Protocol Buffer contracts over gRPC. Keep generated clients behind an application-facing port or service. Translate transport errors at the boundary and propagate request cancellation and deadlines.

## Persistence and Security

Use Prisma as the only PostgreSQL access mechanism once configured. Centralize client lifecycle, use transactions for atomic workflows, avoid unbounded queries, and keep schema migrations committed with model changes.

Protect private routes with NestJS Guards and verified JWTs once authentication is implemented. Authorization belongs in explicit guards or policies, not scattered controller conditionals. Never log secrets, tokens, passwords, or sensitive financial payloads.

## Testing and Verification

Place unit tests beside source as `*.spec.ts` and end-to-end tests under `test/` as `*.e2e-spec.ts`. Test DTO validation, authorization boundaries, service behavior, and persistence adapters. Run focused Jest tests, `pnpm test:e2e` when transport behavior changes, and `pnpm lint`. Never run a build after changes.
