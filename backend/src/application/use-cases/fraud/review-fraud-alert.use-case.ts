import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';

@Injectable()
export class ReviewFraudAlertUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    transactionId: string,
    isFraudulent: boolean,
  ): Promise<void> {
    const transaction = await this.transactionRepository.findById(
      transactionId,
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (isFraudulent) {
      const cancelled = transaction.markAsCancelled();
      await this.transactionRepository.save(cancelled);
    } else {
      const completed = transaction.markAsCompleted();
      await this.transactionRepository.save(completed);
    }
  }
}
