import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { TransactionResponseDto } from '../../dto/transactions/transaction-response.dto';
export declare class GetTransactionHistoryUseCase {
    private readonly transactionRepository;
    constructor(transactionRepository: ITransactionRepository);
    execute(customerId: string): Promise<TransactionResponseDto[]>;
}
