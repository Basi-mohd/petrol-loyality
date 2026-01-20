import { RegenerateQrIdentityUseCase } from '../../../application/use-cases/customer/regenerate-qr-identity.use-case';
import { QrIdentityService } from '../../../infrastructure/services/qr-identity/qr-identity.service';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
export declare class CustomerController {
    private readonly regenerateQrIdentityUseCase;
    private readonly qrIdentityService;
    private readonly customerRepository;
    constructor(regenerateQrIdentityUseCase: RegenerateQrIdentityUseCase, qrIdentityService: QrIdentityService, customerRepository: ICustomerRepository);
    resolveQrToken(qrToken: string): Promise<{
        customerId: string;
        qrToken: string;
    }>;
    regenerateQrIdentity(customerId: string, user: any): Promise<import("../../../application/use-cases/customer/regenerate-qr-identity.use-case").RegenerateQrIdentityResponse>;
    getQrIdentity(user: any): Promise<{
        qrToken: string;
        customerId: string;
    }>;
    getBalance(user: any): Promise<{
        balance: number;
        customerId: string;
        name: string;
    }>;
}
