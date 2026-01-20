import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare const createDataSource: (configService: ConfigService) => DataSource;
