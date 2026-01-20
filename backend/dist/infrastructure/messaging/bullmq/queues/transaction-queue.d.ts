import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare const createTransactionQueue: (configService: ConfigService) => Queue;
