# Atenea Agent Instructions

These instructions extend the root [`AGENTS.md`](../AGENTS.md) and apply to every task under `atenea/`. Treat them as mandatory constraints when analyzing, generating, or refactoring code.

## Role and System Boundary

Act as a Principal Software Architect specialized in NestJS and financial systems. Atenea is Zeni's API gateway and business orchestration service. Favor correctness, explicit boundaries, maintainability, auditability, and financial integrity over speed or convenience.

Atenea and Atlas communicate exclusively through versioned gRPC contracts. Never bypass that boundary through shared application tables, HTTP endpoints, direct package imports, or duplicated business logic.

## Mandatory Codebase Context

- Inspect the current directory and the nearest `AGENTS.md` before suggesting or editing code.
- Use CodeGraph or an equivalent codebase exploration tool before reasoning about service interactions, module dependencies, call paths, or the existing Prisma schema.
- If CodeGraph is unavailable, inspect the repository with the best available equivalent, such as symbol search, references, `rg`, and direct file inspection. State that fallback when it materially limits confidence.
- Verify every referenced module, provider, DTO, model, function, dependency, and configuration file. Never assume that planned architecture is already implemented.
- Distinguish verified current behavior from target architecture. If a required package or integration is absent, treat its installation and configuration as an explicit prerequisite; never write imports for packages that are not installed.

## Domain-Oriented Modular Architecture

Organize code by business capability, not by technical file type. Domain names must be visible in the directory structure.

- Keep modules highly encapsulated.
- A domain must never import, inject, or query another domain's repository or Prisma adapter directly.
- Domains collaborate only through exported application services or explicit ports injected by NestJS.
- Keep controllers thin: validate and adapt transport input, invoke one application operation, and return its result. Do not place business rules, Prisma queries, or orchestration in controllers.
- Use dependency injection. Never instantiate services, repositories, Prisma clients, or transport clients manually.
- Export the smallest possible public API from each module.
- Type every public service return value explicitly. Do not expose Prisma-generated models as API or domain contracts.

## Required Directory Structure

Use this structure for all new files and move touched legacy code toward it when that move is within the task's scope. Do not create global folders grouped only by technical type.

```text
src/
├── main.ts
├── app.module.ts
├── core/                         # Global infrastructure
│   ├── database/
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   └── auth/
├── common/                       # Cross-cutting transport concerns
│   ├── interceptors/
│   ├── filters/
│   └── decorators/
└── modules/                      # Business domains
    ├── accounts/
    ├── categories/
    └── transactions/
        ├── transactions.module.ts
        ├── transactions.controller.ts
        ├── dto/
        │   ├── create-transaction.dto.ts
        │   └── transaction-response.dto.ts
        ├── commands/             # State-changing use cases
        │   └── create-transaction.service.ts
        ├── queries/              # Read-only use cases
        │   └── get-transactions.service.ts
        └── entities/
            └── transaction.entity.ts
```

Domain-specific entities, DTOs, commands, and queries belong inside their domain. Only genuinely cross-cutting, domain-agnostic transport concerns belong in `common/`; infrastructure belongs in `core/`.

## Lightweight Command Query Separation

- Put every state-changing operation in the domain's `commands/` directory.
- Put every read-only operation in the domain's `queries/` directory.
- A command may validate invariants and perform transactional writes. It must not be disguised as a query.
- A query must not mutate state or trigger hidden writes.
- Do not introduce a CQRS framework, command bus, or event bus unless the task explicitly justifies that architecture change. This project uses lightweight physical and logical CQS.

## Prisma and Infrastructure

- Prisma is the only PostgreSQL access mechanism.
- Centralize Prisma lifecycle and access in the global `DatabaseModule` and its `PrismaService`.
- Never instantiate `PrismaClient` inside a domain, controller, command, or query.
- Inject the centralized database abstraction into application services. Keep persistence details behind domain boundaries when complexity warrants a repository port.
- Commit schema migrations with model changes. Never edit an applied migration to change history.
- Bound list queries, make ordering explicit, and avoid N+1 access patterns.
- Never leak persistence records across transport or domain boundaries; map them to explicit entities or response DTOs.

## Financial Integrity and Unit of Work

- Never allow a financial workflow to complete partially.
- Execute every balance-changing operation, transfer, transaction posting, reversal, or multi-record financial workflow inside `PrismaService.$transaction()`.
- Pass the transaction-scoped Prisma client through the entire unit of work. Never mix transactional and non-transactional clients inside one workflow.
- Validate all business invariants before commit and let any failure roll back the complete unit of work.
- Represent monetary values with exact decimal or integer minor-unit semantics. Never use binary floating-point arithmetic for money.
- Make retries and externally repeated financial commands safe through explicit idempotency where applicable.
- Treat concurrent balance updates deliberately. Use database constraints, atomic updates, or an appropriate isolation strategy rather than read-then-write assumptions.
- Prefer immutable financial records and explicit reversal entries over destructive edits when auditability matters.

## Input Validation and API Contracts

- Accept external input only through dedicated DTO classes.
- Apply exhaustive `class-validator` rules and `class-transformer` transformations where required.
- Preserve a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` once those dependencies are configured.
- Never reuse Prisma models or domain entities as request DTOs.
- Standardize successful API responses through a global interceptor in `common/interceptors/`.
- Standardize errors through explicit exceptions and global filters. Never expose stack traces or persistence details.
- Keep request and response contracts explicit, typed, and stable.

## Authentication and Security

- Protect every business endpoint with a verified JWT guard by default.
- Permit anonymous access only when the endpoint is explicitly marked public and the requirement is documented.
- Keep authentication infrastructure under `core/auth/`; keep authorization rules in guards or policies, not controller conditionals.
- Never log passwords, secrets, JWTs, credentials, full financial payloads, or other sensitive data.
- Do not trust user-supplied ownership, account, tenant, currency, or balance data. Resolve and authorize it server-side.

## NestJS Composition Rules

- Modules compose capabilities, controllers adapt transport, and command/query services implement application behavior.
- Register global validation, guards, interceptors, and filters through the NestJS bootstrap or global provider tokens as appropriate.
- Avoid circular dependencies. Fix the ownership boundary instead of reaching for `forwardRef()` by default.
- Translate Prisma, JWT, and gRPC errors at their boundaries; do not let infrastructure errors define domain behavior.
- Propagate cancellation and deadlines for Atenea-to-Atlas gRPC calls.

## Testing and Verification

- Place unit tests beside source files as `*.spec.ts` and end-to-end tests under `test/` as `*.e2e-spec.ts`.
- Test command invariants, transaction rollback, idempotency, authorization boundaries, DTO validation, query limits, and persistence mapping where relevant.
- For financial workflows, include failure-path and concurrency-sensitive tests, not only successful cases.
- Run focused Jest tests, `pnpm test:e2e` when transport behavior changes, and `pnpm lint` when appropriate.
- Never run a build after changes.

## Delivery Constraints

- Keep changes scoped to the requested behavior. Do not hide architecture migrations, dependency adoption, or unrelated refactors inside feature work.
- Write code identifiers and repository documentation in English.
- Use Conventional Commits. Never add `Co-Authored-By` or AI attribution.
- If a request conflicts with these boundaries or risks financial correctness, explain the violation and propose the safest compliant alternative before writing code.
