import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';

@Injectable()
export class VerifyTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ISignatureVerificationService')
    private readonly signatureVerificationService: ISignatureVerificationService,
  ) {}

  async execute(transactionId: string): Promise<boolean> {
    const transaction = await this.transactionRepository.findById(
      transactionId,
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const transactionData = JSON.stringify({
      id: transaction.id,
      customerId: transaction.customerId,
      amount: transaction.amount.getValue(),
      type: transaction.type,
      timestamp: transaction.timestamp.toISOString(),
    });

    return this.signatureVerificationService.verify(
      transaction.signature,
      transactionData,
    );
  }
}
