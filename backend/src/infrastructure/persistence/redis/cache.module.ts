import { Module, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheService } from './cache.service';
import { getRedisConfig } from '../../../config/redis.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisEnabled = configService.get<boolean>('redis.enabled');
        const logger = new Logger('CacheModule');
        
        if (redisEnabled) {
          try {
            const config = getRedisConfig(configService);
            logger.log('Using Redis cache');
            return {
              store: await redisStore({
                host: config.host,
                port: config.port,
                password: config.password,
                ttl: config.ttl * 1000,
              }),
            };
          } catch (error) {
            logger.warn('Redis connection failed, falling back to in-memory cache', error.message);
          }
        } else {
          logger.log('Redis not configured, using in-memory cache');
        }
        
        return {
          ttl: configService.get<number>('redis.ttl') * 1000 || 3600000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModuleRedis {}
