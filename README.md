🌌 Zeni Ecosystem

Zeni is a comprehensive personal finance and budget management platform with a microservices architecture. This monorepo contains the source code for all system components.

🏗️ System Architecture

The ecosystem is divided into specialized services with codenames to clearly define their responsibilities:

📱 Project Iris: The client application in React Native (Frontend).

🛡️ Project Athena: The API Gateway and core business logic (NestJS).

⚙️ Project Atlas: The high-performance Worker for heavy tasks (Go).

🏦 Project Pluto: Main database (PostgreSQL).

🚀 Prerequisites

Docker and Docker Compose (For the backend infrastructure).

Node.js (v24 or higher) and pnpm.

Go (v1.26 or higher).

🛠️ Environment Setup (Development)

The Zeni backend (Athena, Atlas, and the Pluto database) runs through Docker containers to ensure a consistent environment.

Start the backend infrastructure:
At the root of the project (zeni-workspace), run:

docker-compose up -d


This will start PostgreSQL on port 5432, the NestJS API on port 3000, and the Go Worker on port 50051.

Start the mobile application:
Open a new terminal and navigate to the frontend:

cd iris
pnpm start


📜 License

Personal project developed for educational purposes and technical experimentation.