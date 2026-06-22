🛡️ Project Athena (Zeni API Gateway)

Athena is the structured brain of the Zeni ecosystem. Developed in NestJS, it acts as the main API Gateway, managing authentication, daily business logic, and the orchestration of heavy tasks to the Worker (Project Atlas).

🛠️ Tech Stack

Framework: NestJS

Language: TypeScript

ORM: Prisma

Database: PostgreSQL (Project Pluto)

Authentication: JWT

🚀 Local Setup (Without Docker)

If you want to run Athena locally for active development (without using the container provided in docker-compose.yml), follow these steps:

Install dependencies:

pnpm install


Configure environment:
Create a .env file at the root of proyecto-atenea and define the database connection (make sure Pluto is running via Docker):

DATABASE_URL="postgresql://zeni_admin:zeni_password@localhost:5432/zeni_db?schema=public"


Sync Prisma (Migrations):

pnpm dlx prisma db push
# or if using formal migrations: pnpm dlx prisma migrate dev


Start the server:

pnpm run start:dev


The API will be available at http://localhost:3000.

🔗 External Communication

Athena communicates with Project Atlas (Go) using gRPC to delegate the processing of CSV files and heavy financial recalculations.