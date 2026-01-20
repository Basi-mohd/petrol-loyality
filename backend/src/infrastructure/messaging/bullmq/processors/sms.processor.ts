import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../shared/constants/queue-names.constants';

export interface SmsJobData {
  phoneNumber: string;
  message: string;
}

@Processor(QUEUE_NAMES.SMS)
export class SmsProcessor extends WorkerHost {
  async process(job: Job<SmsJobData>): Promise<any> {
    const { phoneNumber, message } = job.data;

    try {
      await job.updateProgress(10);

      await job.updateProgress(50);

      await job.updateProgress(100);

      return {
        success: true,
        phoneNumber,
        sentAt: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }
}
