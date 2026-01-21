"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'petrol_loyalty',
    },
    redis: {
        enabled: process.env.REDIS_HOST !== undefined && process.env.REDIS_HOST !== 'localhost',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    bullmq: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
    },
    sms: {
        provider: process.env.SMS_PROVIDER || 'msg91',
        apiKey: process.env.SMS_API_KEY,
        apiSecret: process.env.SMS_API_SECRET,
        fromNumber: process.env.SMS_FROM_NUMBER,
        msg91: {
            apiKey: process.env.MSG91_API_KEY,
            senderId: process.env.MSG91_SENDER_ID || 'PETROL',
        },
    },
    otp: {
        expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '2', 10),
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
        rateLimitMinutes: parseInt(process.env.OTP_RATE_LIMIT_MINUTES || '5', 10),
        maxRequestsPerWindow: parseInt(process.env.OTP_MAX_REQUESTS_PER_WINDOW || '3', 10),
    },
});
//# sourceMappingURL=configuration.js.map