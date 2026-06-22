# Atlas

Atlas is intended to become Zeni's compute-intensive worker. It is written in Go and will integrate with Atenea to execute tasks that should not block the API.

## Current Status

The project contains a minimal executable that prints a message to the console. It does not yet implement a gRPC server, persistence, or file processing.

## Requirements

- Go 1.26.2 or compatible

## Local Development

Run the worker from this directory:

```bash
go run .
```

Check formatting and tests before submitting changes:

```bash
gofmt -w main.go
go test ./...
```

## Structure

```text
main.go    Worker entry point
go.mod     Module definition for zeni/atlas
```

As the project grows, organize packages by domain responsibility and keep `main.go` limited to dependency assembly. Document Protocol Buffer contracts and their generation commands when they are added to the repository.
