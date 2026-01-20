"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConfig = void 0;
const getRedisConfig = (configService) => ({
    host: configService.get('redis.host'),
    port: configService.get('redis.port'),
    password: configService.get('redis.password'),
    ttl: configService.get('redis.ttl'),
});
exports.getRedisConfig = getRedisConfig;
//# sourceMappingURL=redis.config.js.map