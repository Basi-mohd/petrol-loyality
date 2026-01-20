import { Injectable, Inject } from '@nestjs/common';
import { IFraudDetectionService } from '../../../domain/interfaces/services/fraud-detection.service.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudDetectionResult } from '../../../domain/interfaces/services/fraud-detection.service.interface';

@Injectable()
export class DetectFraudUseCase {
  constructor(
    @Inject('IFraudDetectionService')
    private readonly fraudDetectionService: IFraudDetectionService,
  ) {}

  async execute(transaction: Transaction): Promise<FraudDetectionResult> {
    return this.fraudDetectionService.detectFraud(transaction);
  }
}
