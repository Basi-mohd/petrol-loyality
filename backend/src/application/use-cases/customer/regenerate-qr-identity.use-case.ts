import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QrIdentityService } from '../../../infrastructure/services/qr-identity/qr-identity.service';

export interface RegenerateQrIdentityDto {
  customerId: string;
}

export interface RegenerateQrIdentityResponse {
  qrToken: string;
}

@Injectable()
export class RegenerateQrIdentityUseCase {
  constructor(private readonly qrIdentityService: QrIdentityService) {}

  async execute(
    dto: RegenerateQrIdentityDto,
    authenticatedCustomerId: string,
  ): Promise<RegenerateQrIdentityResponse> {
    if (dto.customerId !== authenticatedCustomerId) {
      throw new UnauthorizedException('Unauthorized to regenerate QR for this customer');
    }

    const qrIdentity = await this.qrIdentityService.regenerateQrIdentity(
      dto.customerId,
    );

    return {
      qrToken: qrIdentity.qrToken,
    };
  }
}
