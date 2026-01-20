import { ConfigService } from '@nestjs/config';
export declare const getJwtConfig: (configService: ConfigService) => {
    secret: string;
    signOptions: {
        expiresIn: any;
    };
};
export declare const getJwtRefreshConfig: (configService: ConfigService) => {
    secret: string;
    signOptions: {
        expiresIn: string;
    };
};
