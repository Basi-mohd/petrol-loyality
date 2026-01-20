import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../../infrastructure/persistence/redis/cache.service';
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly cacheService;
    private readonly windowMs;
    private readonly maxRequests;
    constructor(cacheService: CacheService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
