import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../../infrastructure/persistence/redis/cache.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly windowMs = 60000;
  private readonly maxRequests = 5;

  constructor(private readonly cacheService: CacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const deviceId = req.headers['x-device-id'] as string;
    const phoneNumber = req.body?.phoneNumber as string;

    if (!deviceId) {
      throw new HttpException('Device ID required', HttpStatus.BAD_REQUEST);
    }

    const key = `rate_limit:${phoneNumber || 'unknown'}:${deviceId}`;
    const current = await this.cacheService.get<number>(key);

    if (current && current >= this.maxRequests) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const count = current ? current + 1 : 1;
    await this.cacheService.set(key, count, this.windowMs / 1000);

    res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - count).toString());

    next();
  }
}
