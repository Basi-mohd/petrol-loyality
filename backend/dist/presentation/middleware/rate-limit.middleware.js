"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../../infrastructure/persistence/redis/cache.service");
let RateLimitMiddleware = class RateLimitMiddleware {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.windowMs = 60000;
        this.maxRequests = 5;
    }
    async use(req, res, next) {
        const deviceId = req.headers['x-device-id'];
        const phoneNumber = req.body?.phoneNumber;
        if (!deviceId) {
            throw new common_1.HttpException('Device ID required', common_1.HttpStatus.BAD_REQUEST);
        }
        const key = `rate_limit:${phoneNumber || 'unknown'}:${deviceId}`;
        const current = await this.cacheService.get(key);
        if (current && current >= this.maxRequests) {
            throw new common_1.HttpException('Too many requests. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const count = current ? current + 1 : 1;
        await this.cacheService.set(key, count, this.windowMs / 1000);
        res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - count).toString());
        next();
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map