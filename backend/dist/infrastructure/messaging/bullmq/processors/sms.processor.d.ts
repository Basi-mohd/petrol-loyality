import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export interface SmsJobData {
    phoneNumber: string;
    message: string;
}
export declare class SmsProcessor extends WorkerHost {
    process(job: Job<SmsJobData>): Promise<any>;
}
