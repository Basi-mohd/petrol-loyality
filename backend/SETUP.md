# Backend Setup Guide

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+)

## Database Setup

1. **Create PostgreSQL database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE petrol_loyalty;

# Exit psql
\q
```

2. **Run migrations:**
```bash
cd backend
npm run migration:run
```

## Redis Setup

1. **Install Redis (if not installed):**
```bash
# On Arch Linux
sudo pacman -S redis

# On Ubuntu/Debian
sudo apt-get install redis-server

# On macOS
brew install redis
```

2. **Start Redis:**
```bash
# Start Redis service
sudo systemctl start redis
# Or for macOS
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

## Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=petrol_loyalty

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-256-bits
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-256-bits
JWT_REFRESH_EXPIRES_IN=7d

# SMS (MSG91)
SMS_PROVIDER=msg91
MSG91_API_KEY=your-msg91-api-key
MSG91_SENDER_ID=PETROL

# OTP Configuration
OTP_EXPIRY_MINUTES=2
OTP_MAX_ATTEMPTS=5
OTP_RATE_LIMIT_MINUTES=5
OTP_MAX_REQUESTS_PER_WINDOW=3
```

## Generate Secure JWT Secrets

```bash
# Generate random secrets (use these in .env)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to generate both `JWT_SECRET` and `JWT_REFRESH_SECRET`.

## Installation & Startup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Verify Setup

Once everything is running, you should see:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database exists: `psql -U postgres -l | grep petrol_loyalty`
- Verify credentials in `.env` match your PostgreSQL setup

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping`
- Check Redis port: `netstat -tuln | grep 6379`
- Start Redis if not running: `sudo systemctl start redis`

### Migration Issues
- Ensure database exists before running migrations
- Check migration files are in correct directory
- Verify TypeORM configuration in `database.config.ts`
