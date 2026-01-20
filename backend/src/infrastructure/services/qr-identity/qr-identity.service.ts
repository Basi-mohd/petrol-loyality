import { Injectable, Logger, Inject } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { CustomerQrIdentity } from '../../../domain/entities/customer-qr-identity.entity';
import { ICustomerQrIdentityRepository } from '../../persistence/postgres/repositories/customer-qr-identity.repository';

@Injectable()
export class QrIdentityService {
  private readonly logger = new Logger(QrIdentityService.name);
  private readonly qrTokenLength = 32;

  constructor(
    @Inject('ICustomerQrIdentityRepository')
    private readonly qrIdentityRepository: ICustomerQrIdentityRepository,
  ) {}

  async generateQrIdentity(customerId: string): Promise<CustomerQrIdentity> {
    await this.qrIdentityRepository.deactivateAllForCustomer(customerId);

    const qrToken = this.generateSecureQrToken();
    const identityId = uuidv4();

    const identity = CustomerQrIdentity.create(identityId, customerId, qrToken);
    await this.qrIdentityRepository.save(identity);

    this.logger.log(`QR identity generated for customer ${customerId}`);
    return identity;
  }

  async regenerateQrIdentity(customerId: string): Promise<CustomerQrIdentity> {
    return this.generateQrIdentity(customerId);
  }

  async getQrIdentityByToken(qrToken: string): Promise<CustomerQrIdentity | null> {
    return this.qrIdentityRepository.findByQrToken(qrToken);
  }

  async getActiveQrIdentity(customerId: string): Promise<CustomerQrIdentity | null> {
    return this.qrIdentityRepository.findActiveByCustomerId(customerId);
  }

  private generateSecureQrToken(): string {
    const randomBuffer = randomBytes(this.qrTokenLength);
    return randomBuffer.toString('base64url').substring(0, this.qrTokenLength);
  }
}
