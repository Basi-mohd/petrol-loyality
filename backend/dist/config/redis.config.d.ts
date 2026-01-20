import { ConfigService } from '@nestjs/config';
export declare const getRedisConfig: (configService: ConfigService) => {
    host: string;
    port: number;
    password: string;
    ttl: number;
};
