"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModuleRedis = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const cache_manager_ioredis_yet_1 = require("cache-manager-ioredis-yet");
const cache_service_1 = require("./cache.service");
const redis_config_1 = require("../../../config/redis.config");
let CacheModuleRedis = class CacheModuleRedis {
};
exports.CacheModuleRedis = CacheModuleRedis;
exports.CacheModuleRedis = CacheModuleRedis = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redisEnabled = configService.get('redis.enabled');
                    const logger = new common_1.Logger('CacheModule');
                    const ttlMs = (configService.get('redis.ttl') || 3600) * 1000;
                    if (redisEnabled) {
                        try {
                            const config = (0, redis_config_1.getRedisConfig)(configService);
                            logger.log('Using Redis cache');
                            return {
                                store: await (0, cache_manager_ioredis_yet_1.redisStore)({
                                    host: config.host,
                                    port: config.port,
                                    password: config.password,
                                    ttl: ttlMs,
                                }),
                                ttl: ttlMs,
                            };
                        }
                        catch (error) {
                            logger.warn(`Redis connection failed, falling back to in-memory cache: ${error instanceof Error ? error.message : String(error)}`);
                        }
                    }
                    else {
                        logger.log('Redis not configured, using in-memory cache');
                    }
                    return {
                        ttl: ttlMs,
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [cache_service_1.CacheService],
        exports: [cache_service_1.CacheService],
    })
], CacheModuleRedis);
//# sourceMappingURL=cache.module.js.map