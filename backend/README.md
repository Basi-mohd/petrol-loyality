# Petrol Pump Loyalty Ledger System - Backend

NestJS backend implementing Clean Architecture for a petrol pump loyalty ledger system.

## Architecture

This backend follows Clean Architecture principles with four layers:

1. **Domain Layer** - Core business entities and rules (no dependencies)
2. **Application Layer** - Use cases and business logic orchestration
3. **Infrastructure Layer** - External integrations (DB, Redis, SMS, etc.)
4. **Presentation Layer** - HTTP controllers, DTOs, and API contracts

## Features

- PostgreSQL with TypeORM for append-only ledger
- Redis caching
- BullMQ for async job processing
- JWT authentication with role-based access control
- Transaction signature verification
- Fraud detection engine
- Daily reconciliation
- SMS integration
- Comprehensive audit logging
- Offline transaction sync

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see `.env.example`)

3. Run migrations:
```bash
npm run migration:run
```

4. Start the application:
```bash
npm run start:dev
```

## API Endpoints

- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- `POST /transactions` - Create transaction (Staff/Admin)
- `GET /transactions/history/:customerId` - Get transaction history
- `GET /transactions/verify/:transactionId` - Verify transaction
- `POST /transactions/sync` - Sync offline transactions
- `POST /ledger/append/:transactionId` - Append ledger entry (Admin)
- `GET /ledger/verify-integrity` - Verify ledger integrity (Admin)
- `GET /health` - Health check

## Testing

```bash
npm run test
npm run test:e2e
```
