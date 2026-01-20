import { QrIdentityService } from '../../../infrastructure/services/qr-identity/qr-identity.service';
export interface RegenerateQrIdentityDto {
    customerId: string;
}
export interface RegenerateQrIdentityResponse {
    qrToken: string;
}
export declare class RegenerateQrIdentityUseCase {
    private readonly qrIdentityService;
    constructor(qrIdentityService: QrIdentityService);
    execute(dto: RegenerateQrIdentityDto, authenticatedCustomerId: string): Promise<RegenerateQrIdentityResponse>;
}
