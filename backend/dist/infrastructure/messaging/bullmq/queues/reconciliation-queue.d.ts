import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare const createReconciliationQueue: (configService: ConfigService) => Queue;
