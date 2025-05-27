# Scelloo Backend Assessment - Task Management System

## Features

- User authentication and authorization
- Task management (CRUD operations)
- PostgreSQL database with Sequelize ORM
- TypeScript for type safety
- Docker support for easy deployment
- Environment-based configuration
- Input validation using Zod
- JWT-based authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v17 or higher)
- Docker and Docker Compose (for containerized setup)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TijanAyo/task-management-system.git
cd task-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
SALT=

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=task_management

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

```

Note: For production deployment, make sure to:

- Set `NODE_ENV=production`
- Use strong, unique values for `JWT_SECRET`
- Set appropriate database credentials

## Running with Docker

1. Start the PostgreSQL database with .env.dev credential

```bash
docker compose --env-file .env.dev up
```

2. Build and run the application:

```bash
# Build the application
npm run build

# Start the application
npm start
```

## Database Migrations

The project uses Sequelize CLI for database migrations. To run migrations:

```bash
# Run migrations
npm run db:migrate

# Undo the last migration
npm run db:migrate:undo
```

## Development

To run the application in development mode with hot-reload:

```bash
npm run start:dev
```

## Testing

The project includes Jest for testing

```bash
# Run tests
npm test
```

## API Documentation

The API endpoints are organized as follows:

### Authentication

- POST /api/v1/auth/register - Register a new user
- POST /api/v1/auth/login - Login user

### Tasks

- GET /api/v1/tasks - Get all tasks
- POST /api/v1/tasks - Create a new task
- GET /api/v1/tasks/:taskId - Get a specific task
- PATCH /api/v1/tasks/:taskId - Update a task
- DELETE /api/v1/tasks/:taskId - Delete a task
- GET /api/v1/tasks/report-time - Generate task time report across all task
- GET /api/v1/task/reports - Generate completion report across all task

### Admin

- GET /api/v1/admin/view-users - View all users on the app
- GET /api/v1/admin/tasks/view-task - View all task on the app
