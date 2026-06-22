# Atlas Agent Instructions

These instructions extend the root [`AGENTS.md`](../AGENTS.md). Apply them to all work under `atlas/`.

## Context

Atlas is Zeni's Go worker for CPU-intensive workloads such as large CSV imports and financial recalculation. The current project is a minimal executable. gRPC and Protocol Buffers are target technologies but are not implemented yet; add their toolchain and contracts explicitly before writing generated imports.

## Go Philosophy

- Keep code simple, flat, and idiomatic. Prefer small packages, explicit dependencies, and straightforward control flow over speculative abstractions.
- Use short lowercase package names and descriptive exported identifiers. Format every changed Go file with `gofmt`.
- Return errors with useful context and preserve the original cause with `%w` when wrapping.
- Handle every error explicitly with `if err != nil`. Never discard errors with `_` unless the value is provably not an error and the reason is obvious.
- Pass `context.Context` through request-scoped and cancellable work. Do not store contexts in structs.

## Concurrency

Use goroutines and channels only when concurrency provides measured or clear workload value. Every goroutine must have defined ownership, cancellation, completion, and error propagation.

- Bound worker pools and queues; never create unbounded goroutines for large batches.
- Avoid shared mutable state. When unavoidable, protect it with the appropriate synchronization primitive.
- Close channels from the sending side and prevent sends after cancellation.
- Preserve deterministic output ordering when the contract requires it.
- Add race-sensitive tests and run `go test -race ./...` for concurrency changes.

## gRPC Boundaries

Atenea and Atlas communicate exclusively through versioned Protocol Buffer contracts over gRPC. Keep `.proto` files in an explicit contract location and generated Go files in a dedicated package, separate from pure business logic. Generated files must never be edited manually.

Map protobuf messages to domain types at the transport boundary. Validate requests, honor deadlines and cancellation, return appropriate gRPC status codes, and avoid exposing internal error details.

## Structure and Verification

Keep `main.go` limited to configuration and dependency assembly. Place parsing, calculations, and domain rules in testable packages independent of gRPC-generated code. Use table-driven tests where they improve coverage and clarity.

Run `gofmt` on changed files, `go vet ./...`, and `go test ./...`; add `go test -race ./...` for concurrent code. Never run a build after changes.
