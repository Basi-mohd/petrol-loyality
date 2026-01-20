import { CustomerQrIdentity } from '../../../domain/entities/customer-qr-identity.entity';
import { ICustomerQrIdentityRepository } from '../../persistence/postgres/repositories/customer-qr-identity.repository';
export declare class QrIdentityService {
    private readonly qrIdentityRepository;
    private readonly logger;
    private readonly qrTokenLength;
    constructor(qrIdentityRepository: ICustomerQrIdentityRepository);
    generateQrIdentity(customerId: string): Promise<CustomerQrIdentity>;
    regenerateQrIdentity(customerId: string): Promise<CustomerQrIdentity>;
    getQrIdentityByToken(qrToken: string): Promise<CustomerQrIdentity | null>;
    getActiveQrIdentity(customerId: string): Promise<CustomerQrIdentity | null>;
    private generateSecureQrToken;
}
