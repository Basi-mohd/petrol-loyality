import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionResponseDto } from '../dto/transactions/transaction-response.dto';

export class TransactionMapper {
  static toResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      customerId: transaction.customerId,
      amount: transaction.amount.getValue(),
      type: transaction.type,
      status: transaction.status,
      timestamp: transaction.timestamp,
      hash: transaction.hash,
      metadata: transaction.metadata,
    };
  }

  static toResponseDtoList(
    transactions: Transaction[],
  ): TransactionResponseDto[] {
    return transactions.map((t) => this.toResponseDto(t));
  }
}
