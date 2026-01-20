import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { TransactionResponseDto } from '../../dto/transactions/transaction-response.dto';
import { TransactionMapper } from '../../mappers/transaction.mapper';

@Injectable()
export class GetTransactionHistoryUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(customerId: string): Promise<TransactionResponseDto[]> {
    const transactions =
      await this.transactionRepository.findByCustomerId(customerId);
    return TransactionMapper.toResponseDtoList(transactions);
  }
}
