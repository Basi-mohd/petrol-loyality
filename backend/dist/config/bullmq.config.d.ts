import { ConfigService } from '@nestjs/config';
export declare const getBullMQConfig: (configService: ConfigService) => {
    connection: {
        host: string;
        port: number;
        password: string;
    };
};
