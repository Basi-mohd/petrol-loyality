import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare const createSmsQueue: (configService: ConfigService) => Queue;
