import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionResponseDto } from '../dto/transactions/transaction-response.dto';
export declare class TransactionMapper {
    static toResponseDto(transaction: Transaction): TransactionResponseDto;
    static toResponseDtoList(transactions: Transaction[]): TransactionResponseDto[];
}
