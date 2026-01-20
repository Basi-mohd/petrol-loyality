import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { RegenerateQrIdentityUseCase } from '../../../application/use-cases/customer/regenerate-qr-identity.use-case';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { QrIdentityService } from '../../../infrastructure/services/qr-identity/qr-identity.service';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly regenerateQrIdentityUseCase: RegenerateQrIdentityUseCase,
    private readonly qrIdentityService: QrIdentityService,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  @Post('qr/resolve')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resolveQrToken(@Body('qrToken') qrToken: string) {
    const qrIdentity = await this.qrIdentityService.getQrIdentityByToken(qrToken);
    if (!qrIdentity || !qrIdentity.isActive || qrIdentity.isExpired()) {
      throw new BadRequestException('Invalid or inactive QR token');
    }
    return {
      customerId: qrIdentity.customerId,
      qrToken: qrIdentity.qrToken,
    };
  }

  @Post('qr/regenerate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async regenerateQrIdentity(
    @Body('customerId') customerId: string,
    @CurrentUser() user: any,
  ) {
    return this.regenerateQrIdentityUseCase.execute(
      { customerId },
      user.userId || user.sub,
    );
  }

  @Get('qr')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getQrIdentity(@CurrentUser() user: any) {
    const customerId = user.userId || user.sub;
    const qrIdentity = await this.qrIdentityService.getActiveQrIdentity(
      customerId,
    );
    if (!qrIdentity) {
      throw new BadRequestException('QR identity not found');
    }
    return {
      qrToken: qrIdentity.qrToken,
      customerId: qrIdentity.customerId,
    };
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getBalance(@CurrentUser() user: any) {
    const customerId = user.userId || user.sub;
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return {
      balance: customer.balance.getValue(),
      customerId: customer.id,
      name: customer.name,
    };
  }
}
