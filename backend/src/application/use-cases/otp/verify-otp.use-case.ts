import { Injectable, BadRequestException, Inject, Logger } from '@nestjs/common';
import { OtpService } from '../../../infrastructure/services/otp/otp.service';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { PhoneNumber } from '../../../domain/value-objects/phone-number.vo';
import { Amount } from '../../../domain/value-objects/amount.vo';
import { Customer } from '../../../domain/entities/customer.entity';
import { QrIdentityService } from '../../../infrastructure/services/qr-identity/qr-identity.service';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { AuditService } from '../../../infrastructure/audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

export interface VerifyOtpDto {
  otpId: string;
  code: string;
  phoneNumber: string;
  deviceId: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  customer: {
    id: string;
    phoneNumber: string;
    qrToken: string;
  };
  isNewCustomer: boolean;
}

@Injectable()
export class VerifyOtpUseCase {
  private readonly logger = new Logger(VerifyOtpUseCase.name);

  constructor(
    private readonly otpService: OtpService,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    private readonly qrIdentityService: QrIdentityService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async execute(dto: VerifyOtpDto): Promise<VerifyOtpResponse> {
    try {
      const isValid = await this.otpService.verifyOtp(
        dto.otpId,
        dto.code,
        dto.phoneNumber,
        dto.deviceId,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid OTP code');
      }

      let customer = await this.customerRepository.findByPhoneNumber(
        PhoneNumber.create(dto.phoneNumber),
      );

    let isNewCustomer = false;

    if (!customer) {
      customer = Customer.create(
        uuidv4(),
        PhoneNumber.create(dto.phoneNumber),
        `Customer ${dto.phoneNumber.substring(dto.phoneNumber.length - 4)}`,
        Amount.create(0),
      );
      await this.customerRepository.save(customer);
      isNewCustomer = true;

      await this.auditService.log(
        customer.id,
        'CUSTOMER',
        'CUSTOMER_CREATED',
        'CUSTOMER',
        customer.id,
        {
          phoneNumber: dto.phoneNumber,
          deviceId: dto.deviceId.substring(0, 8) + '...',
        },
      );
    }

    let qrIdentity = await this.qrIdentityService.getActiveQrIdentity(customer.id);
    if (!qrIdentity) {
      qrIdentity = await this.qrIdentityService.generateQrIdentity(customer.id);

      await this.auditService.log(
        customer.id,
        'CUSTOMER',
        'QR_IDENTITY_GENERATED',
        'QR_IDENTITY',
        qrIdentity.id,
        {
          customerId: customer.id,
          qrToken: qrIdentity.qrToken.substring(0, 8) + '...',
        },
      );
    }

    const payload = {
      sub: customer.id,
      phoneNumber: customer.phoneNumber.getCleaned(),
      role: 'CUSTOMER',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken(payload),
      this.jwtService.generateRefreshToken(payload),
    ]);

      return {
        accessToken,
        refreshToken,
        customer: {
          id: customer.id,
          phoneNumber: customer.phoneNumber.getCleaned(),
          qrToken: qrIdentity.qrToken,
        },
        isNewCustomer,
      };
    } catch (error) {
      this.logger.error(`Error in verify OTP: ${error.message}`, error.stack);
      throw error;
    }
  }
}
