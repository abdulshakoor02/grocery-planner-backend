# Grocery Planner Backend - Project Context

## Project Structure

```
grocery-planner-backend/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── env.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── index.ts
│   ├── models/
│   │   ├── env.ts
│   │   ├── index.ts
│   │   └── interfaces/
│   │       ├── index.ts
│   │       └── users.ts
│   ├── repository/ (empty)
│   └── service/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── jwt.strategy.ts
│       │   └── index.ts
│       ├── database/
│       │   ├── database.module.ts
│       │   ├── database.service.ts
│       │   ├── database.ts
│       │   └── index.ts
│       ├── user/
│       │   ├── user.module.ts
│       │   ├── user.service.ts
│       │   └── index.ts
│       ├── logger.service.ts
│       ├── logging.middleware.ts
│       └── index.ts
├── package.json
└── ...
```

## Key Components

1. **Main Application Files**:
   - `main.ts`: Entry point using Fastify adapter with global validation
   - `app.module.ts`: Root module importing AuthModule, DbModule, and UserModule, with logging middleware
   - `app.controller.ts`: Basic controller with a single GET endpoint
   - `app.service.ts`: Basic service returning "Hello World!"

2. **Authentication**:
   - `controllers/auth.controller.ts`: Handles login, registration, profile, and token validation endpoints
   - `service/auth/auth.service.ts`: Implements authentication logic with JWT tokens (uses UserService), with comprehensive logging
   - `service/auth/auth.module.ts`: Auth module with JWT configuration
   - `service/auth/jwt.strategy.ts`: JWT strategy for Passport.js (uses UserService)

3. **User Management**:
   - `controllers/user.controller.ts`: Handles user registration and profile endpoints
   - `service/user/user.service.ts`: Implements user operations (create, find by email, find by email and password), with logging
   - `service/user/user.module.ts`: User module

4. **Logging**:
   - `service/logger.service.ts`: Custom Winston logger with file rotation and structured logging
   - `service/logging.middleware.ts`: Middleware for logging HTTP requests with response times

5. **Database Layer**:
   - Using Sequelize ORM with PostgreSQL
   - `service/database/database.ts`: Sequelize instance configuration with query logging
   - `service/database/database.service.ts`: Database service with model sync and connection logging
   - `service/database/database.module.ts`: Database module
   - `models/interfaces/users.ts`: User model definition

6. **Environment Configuration**:
   - `env.ts`: Loads environment variables using dotenv
   - `models/env.ts`: Defines the Env type structure

7. **Dependencies**:
   - NestJS core packages
   - Fastify as HTTP adapter
   - Sequelize for database ORM
   - Winston for logging
   - Passport for authentication
   - JWT for token-based authentication
   - bcrypt for password hashing
   - class-validator for input validation