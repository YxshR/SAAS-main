# AI Summarization Platform - Backend

Node.js/Express backend for the AI Summarization Platform.

## Features

- **Express.js** with TypeScript
- **Prisma** ORM for database operations
- **Redis** for caching and session management
- **JWT** authentication with refresh tokens
- **Winston** logging with structured logs
- **Comprehensive error handling** with custom error classes
- **Rate limiting** and security middleware
- **Health check endpoints** with dependency monitoring

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis server
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

The server will start on port 8000 (or the port specified in your .env file).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## API Endpoints

### Health Check
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health check with dependencies

### Authentication (Coming Soon)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/verify-phone` - Phone verification
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### User Management (Coming Soon)
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/usage` - Get usage statistics

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Application entry point
├── logs/                # Application logs
├── dist/                # Compiled JavaScript (generated)
└── prisma/              # Database schema and migrations
```

## Environment Variables

See `.env.example` for all required environment variables.

## Logging

The application uses Winston for structured logging:
- `logs/all.log` - All application logs
- `logs/error.log` - Error logs only
- `logs/requests.log` - HTTP request logs
- `logs/audit.log` - Audit trail logs

## Error Handling

The application includes comprehensive error handling:
- Custom `AppError` class for operational errors
- Global error handler middleware
- Structured error logging
- Development vs production error responses

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- JWT token authentication
- Password hashing with bcrypt

## Database

Uses Prisma ORM with PostgreSQL. The schema will be defined in the shared infrastructure setup phase.

## Caching

Redis is used for:
- Session management
- OTP storage
- Rate limiting
- General caching

## Development

The backend is configured for hot reloading during development. TypeScript files are automatically compiled and the server restarts on changes.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Make sure all environment variables are properly configured for production.