declare const _default: () => {
    port: number;
    environment: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
        ttl: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    bullmq: {
        host: string;
        port: number;
        password: string;
    };
    sms: {
        provider: string;
        apiKey: string;
        apiSecret: string;
        fromNumber: string;
        msg91: {
            apiKey: string;
            senderId: string;
        };
    };
    otp: {
        expiryMinutes: number;
        maxAttempts: number;
        rateLimitMinutes: number;
        maxRequestsPerWindow: number;
    };
};
export default _default;
