import { TransactionSignature } from '../../value-objects/transaction-signature.vo';

export interface ISignatureVerificationService {
  verify(
    signature: TransactionSignature,
    data: string,
  ): Promise<boolean>;
}
