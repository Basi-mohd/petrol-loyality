import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class ReviewFraudAlertUseCase {
    private readonly transactionRepository;
    constructor(transactionRepository: ITransactionRepository);
    execute(transactionId: string, isFraudulent: boolean): Promise<void>;
}
