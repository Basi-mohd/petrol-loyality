import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
import { TransactionSignature } from '../../../domain/value-objects/transaction-signature.vo';
export declare class SignatureVerificationService implements ISignatureVerificationService {
    verify(signature: TransactionSignature, data: string): Promise<boolean>;
}
