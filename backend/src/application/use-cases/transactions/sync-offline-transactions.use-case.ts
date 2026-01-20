import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Amount } from '../../../domain/value-objects/amount.vo';
import { TransactionSignature } from '../../../domain/value-objects/transaction-signature.vo';
import { TransactionType } from '../../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../domain/enums/transaction-status.enum';
import { OfflineSyncDto } from '../../dto/sync/offline-sync.dto';
import { InvalidSignatureException } from '../../../domain/exceptions/invalid-signature.exception';

@Injectable()
export class SyncOfflineTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ISignatureVerificationService')
    private readonly signatureVerificationService: ISignatureVerificationService,
  ) {}

  async execute(dto: OfflineSyncDto): Promise<{
    synced: number;
    failed: number;
    errors: string[];
  }> {
    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const txData of dto.transactions) {
      try {
        const existing = await this.transactionRepository.findById(txData.id);
        if (existing) {
          continue;
        }

        const transactionData = JSON.stringify({
          id: txData.id,
          customerId: txData.customerId,
          amount: txData.amount,
          type: txData.type,
          timestamp: txData.timestamp,
        });

        const signature = TransactionSignature.create(
          txData.signature,
          txData.publicKey,
        );

        const isValid =
          await this.signatureVerificationService.verify(
            signature,
            transactionData,
          );

        if (!isValid) {
          failed++;
          errors.push(`Invalid signature for transaction ${txData.id}`);
          continue;
        }

        const transaction = Transaction.reconstruct(
          txData.id,
          txData.customerId,
          Amount.create(txData.amount),
          txData.type as TransactionType,
          TransactionStatus.SYNC_PENDING,
          signature,
          new Date(txData.timestamp),
          txData.metadata || {},
        );

        await this.transactionRepository.save(transaction);
        synced++;
      } catch (error) {
        failed++;
        errors.push(`Error syncing transaction ${txData.id}: ${error.message}`);
      }
    }

    return { synced, failed, errors };
  }
}
