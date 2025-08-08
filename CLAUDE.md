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
│   │   ├── ai.controller.ts
│   │   └── index.ts
│   ├── models/
│   │   ├── env.ts
│   │   ├── index.ts
│   │   ├── dto/
│   │   │   ├── index.ts
│   │   │   └── user.ts
│   │   └── interfaces/
│   │       ├── index.ts
│   │       ├── users.ts
│   │       └── messages.ts
│   ├── repository/
│   │   ├── messagesRepo/
│   │   │   └── messageHandlers.ts
│   │   └── userRepo/
│   │       └── users.ts
│   └── service/
│       ├── ai/
│       │   ├── ai.module.ts
│       │   ├── ai.service.ts
│       │   └── index.ts
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── jwt.strategy.ts
│       │   ├── auth.guard.ts
│       │   └── index.ts
│       ├── database/
│       │   ├── database.module.ts
│       │   ├── database.service.ts
│       │   ├── database.ts
│       │   └── index.ts
│       ├── embeddings/
│       │   ├── embeddings.service.ts
│       │   └── index.ts
│       ├── logger.service.ts
│       ├── logging.middleware.ts
│       ├── qdrant/
│       │   ├── qdrant.module.ts
│       │   ├── qdrant.service.ts
│       │   └── index.ts
│       ├── user/
│       │   ├── user.module.ts
│       │   ├── user.service.ts
│       │   └── index.ts
│       └── index.ts
├── package.json
└── ...
```

## Key Components

1. **Main Application Files**:
   - `main.ts`: Entry point using Fastify adapter with global validation
   - `app.module.ts`: Root module importing AuthModule, DbModule, UserModule, AIModule, and QdrantModule, with logging middleware
   - `app.controller.ts`: Basic controller with a single GET endpoint
   - `app.service.ts`: Basic service returning "Hello World!"

2. **Authentication System**:
   - `controllers/auth.controller.ts`: Handles login, registration, profile, and token validation endpoints
   - `service/auth/auth.service.ts`: Implements authentication logic with JWT tokens (uses UserService), with comprehensive logging
   - `service/auth/auth.module.ts`: Auth module with JWT configuration
   - `service/auth/jwt.strategy.ts`: JWT strategy for Passport.js (uses UserService)
   - `service/auth/auth.guard.ts`: Authentication guard to protect routes

3. **User Management**:
   - `controllers/user.controller.ts`: Handles user registration and profile endpoints
   - `service/user/user.service.ts`: Implements user operations (create, find by email, find by email and password), with logging
   - `service/user/user.module.ts`: User module
   - `models/interfaces/users.ts`: User model definition with Sequelize ORM
   - `models/dto/user.ts`: DTOs for user creation and retrieval
   - `repository/userRepo/users.ts`: Repository functions for user data access

4. **AI and Product Search System**:
   - `controllers/ai.controller.ts`: Handles AI product search requests
   - `service/ai/ai.service.ts`: Implements AI logic for extracting products and searching for them
   - `service/ai/ai.module.ts`: AI module
   - `service/embeddings/embeddings.service.ts`: Handles text embeddings using Xenova transformers
   - `service/qdrant/qdrant.service.ts`: Handles vector search operations with Qdrant
   - `service/qdrant/qdrant.module.ts`: Qdrant module

5. **Messaging System**:
   - `models/interfaces/messages.ts`: Messages model definition with Sequelize ORM
   - `repository/messagesRepo/messageHandlers.ts`: Repository functions for chat message operations

6. **Logging**:
   - `service/logger.service.ts`: Custom Winston logger with file rotation and structured logging
   - `service/logging.middleware.ts`: Middleware for logging HTTP requests with response times

7. **Database Layer**:
   - Using Sequelize ORM with PostgreSQL
   - `service/database/database.ts`: Sequelize instance configuration with query logging
   - `service/database/database.service.ts`: Database service with model sync and connection logging
   - `service/database/database.module.ts`: Database module

8. **Environment Configuration**:
   - `env.ts`: Loads environment variables using dotenv
   - `models/env.ts`: Defines the Env type structure

## API Endpoints

### Authentication
- `POST /auth/login`: User login with email and password
- `POST /auth/register`: User registration
- `GET /auth/profile`: Get user profile (requires authentication)
- `GET /auth/validate-token`: Validate JWT token

### Users
- `POST /users/register`: User registration (alternative endpoint)
- `GET /users/profile`: Get user profile with user ID

### AI Product Search
- `POST /ai/products`: Search for products based on natural language prompt

## Dependencies

### Core Framework
- NestJS core packages
- Fastify as HTTP adapter
- class-validator for input validation

### Database
- Sequelize for database ORM
- PostgreSQL client (pg)
- pg-hstore for PostgreSQL data types

### Authentication
- Passport for authentication
- JWT for token-based authentication
- bcrypt for password hashing

### AI and Embeddings
- @xenova/transformers for text embeddings
- @qdrant/js-client-rest for vector database operations
- OpenAI SDK for LLM operations

### Logging
- Winston for logging
- winston-daily-rotate-file for log rotation

### Utilities
- dotenv for environment variables
- uuid for generating unique identifiers
- class-transformer for object transformation

## Environment Variables

The application requires the following environment variables:

```
# Server Configuration
PORT=3000

# Database Configuration
DB_NAME=your_database_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_IDLE=10000

# Qdrant Configuration
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=your_openai_base_url
OPENAI_MODEL=your_preferred_model

# JWT Configuration
JWT_SECRET=your_jwt_secret
```

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `name`: STRING (Required)
- `email`: STRING (Required, Unique)
- `mobile`: STRING (Required)
- `password`: STRING (Required)
- `active`: BOOLEAN (Default: true)
- `createdAt`: DATE
- `updatedAt`: DATE
- `deletedAt`: DATE

### Messages Table
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key to Users)
- `chatId`: STRING (Foreign Key to Messages)
- `role`: STRING (Required)
- `messages`: TEXT (Required)
- `createdAt`: DATE
- `updatedAt`: DATE
- `deletedAt`: DATE

## Authentication Flow

1. User registers via `/auth/register` or `/users/register`
2. Password is hashed using bcrypt before storage
3. User logs in via `/auth/login` with email and password
4. Server validates credentials and generates JWT token
5. Client includes JWT token in Authorization header as Bearer token
6. Protected routes use AuthGuard to validate token
7. Token payload contains user ID and email
8. User profile can be retrieved via `/auth/profile` or `/users/profile`

## AI Product Search Flow

1. User sends product search request to `/ai/products` with natural language prompt
2. AIService extracts product names from prompt using OpenAI
3. Each product name is converted to embeddings using Xenova transformers
4. Embeddings are used to search for similar products in Qdrant vector database
5. Results are returned to the user

## Logging System

The application uses Winston for structured logging with the following features:

1. Console logging with colors for development
2. Daily rotating log files for all logs in `/logs/app-%DATE%.log`
3. Daily rotating log files for errors only in `/logs/error-%DATE%.log`
4. HTTP request logging via middleware
5. Database query logging
6. Structured logging with timestamps and metadata
7. Log rotation with size limits and retention policies

## Security Considerations

1. Passwords are hashed using bcrypt with 10 rounds
2. JWT tokens are used for stateless authentication
3. Authentication guard protects sensitive endpoints
4. Input validation using class-validator decorators
5. Environment variables for sensitive configuration
6. Structured logging for security events
7. Proper error handling without exposing sensitive information

## Performance Features

1. Database connection pooling
2. Query benchmarking and logging
3. Request timing and performance monitoring
4. Structured logging for performance analysis
5. Caching considerations for embeddings and AI responses