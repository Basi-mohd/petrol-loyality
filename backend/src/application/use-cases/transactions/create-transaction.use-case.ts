import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ILedgerRepository } from '../../../domain/interfaces/repositories/ledger.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { IFraudDetectionService } from '../../../domain/interfaces/services/fraud-detection.service.interface';
import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Amount } from '../../../domain/value-objects/amount.vo';
import { TransactionSignature } from '../../../domain/value-objects/transaction-signature.vo';
import { TransactionType } from '../../../domain/enums/transaction-type.enum';
import { CreateTransactionDto } from '../../dto/transactions/create-transaction.dto';
import { TransactionResponseDto } from '../../dto/transactions/transaction-response.dto';
import { TransactionMapper } from '../../mappers/transaction.mapper';
import { InvalidSignatureException } from '../../../domain/exceptions/invalid-signature.exception';
import { InsufficientBalanceException } from '../../../domain/exceptions/insufficient-balance.exception';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ILedgerRepository')
    private readonly ledgerRepository: ILedgerRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('IFraudDetectionService')
    private readonly fraudDetectionService: IFraudDetectionService,
    @Inject('ISignatureVerificationService')
    private readonly signatureVerificationService: ISignatureVerificationService,
  ) {}

  async execute(
    dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const amount = Amount.create(dto.amount);
    const signature = TransactionSignature.create(dto.signature, dto.publicKey);

    const transactionData = JSON.stringify({
      customerId: dto.customerId,
      amount: dto.amount,
      type: dto.type,
      timestamp: new Date().toISOString(),
    });

    const isValidSignature =
      await this.signatureVerificationService.verify(
        signature,
        transactionData,
      );

    if (!isValidSignature) {
      throw new InvalidSignatureException();
    }

    if (dto.type === TransactionType.DEBIT) {
      if (customer.balance.isGreaterThan(amount) || customer.balance.equals(amount)) {
        // OK
      } else {
        throw new InsufficientBalanceException(
          amount.getValue(),
          customer.balance.getValue(),
        );
      }
    }

    const lastHash = await this.ledgerRepository.getLastHash(dto.customerId);
    const previousHash = lastHash || null;

    const transaction = Transaction.create(
      dto.customerId,
      amount,
      dto.type as TransactionType,
      signature,
      dto.metadata || {},
      previousHash?.getValue(),
    );

    const fraudResult = await this.fraudDetectionService.detectFraud(
      transaction,
    );

    if (fraudResult.isFraudulent) {
      const failedTransaction = transaction.markAsFailed();
      await this.transactionRepository.save(failedTransaction);
      throw new Error(`Fraud detected: ${fraudResult.reasons.join(', ')}`);
    }

    const completedTransaction = transaction.markAsCompleted();
    await this.transactionRepository.save(completedTransaction);

    const ledgerEntry = await this.ledgerRepository.getLastEntry(
      dto.customerId,
    );
    const ledgerPreviousHash = ledgerEntry?.hash || null;

    const { LedgerEntry } = await import('../../../domain/entities/ledger-entry.entity');
    const newLedgerEntry = LedgerEntry.create(
      completedTransaction.id,
      dto.customerId,
      amount,
      dto.type as TransactionType,
      ledgerPreviousHash,
      dto.metadata || {},
    );
    await this.ledgerRepository.append(newLedgerEntry);

    if (dto.type === TransactionType.CREDIT) {
      const updatedCustomer = customer.credit(amount);
      await this.customerRepository.update(updatedCustomer);
    } else if (dto.type === TransactionType.DEBIT) {
      const updatedCustomer = customer.debit(amount);
      await this.customerRepository.update(updatedCustomer);
    }

    return TransactionMapper.toResponseDto(completedTransaction);
  }
}
