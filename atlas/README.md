⚙️ Project Atlas (Zeni High-Performance Worker)

Atlas is the high-performance engine of the Zeni ecosystem. Written in Go, its sole responsibility is to execute CPU-intensive tasks concurrently, freeing Athena (NestJS) from bottlenecks.

🎯 Main Responsibilities

Massive Ingestion: Concurrent parsing, validation, and formatting of thousands of records from bank statement files (CSV/OFX).

Analytical Engine: Execution of heavy mathematical calculations for long-term financial projections.

🛠️ Tech Stack

Language: Go (Golang)

Communication: gRPC / Protocol Buffers

Data Access: [Define ORM or driver, e.g., GORM or pgx]

🚀 Local Development

To work on Atlas outside its Docker container:

Download dependencies (modules):

go mod tidy


Generate gRPC code (If you modify contracts):
(Requires having protoc and Go plugins installed)

# Example command (adjust according to protos structure)
# protoc --go_out=. --go-grpc_out=. proto/zeni.proto


Run the service:

go run main.go


By default, the gRPC service will listen on port :50051.