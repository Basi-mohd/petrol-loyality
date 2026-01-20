import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../application/use-cases/transactions/create-transaction.use-case';
import { GetTransactionHistoryUseCase } from '../../../application/use-cases/transactions/get-transaction-history.use-case';
import { VerifyTransactionUseCase } from '../../../application/use-cases/transactions/verify-transaction.use-case';
import { SyncOfflineTransactionsUseCase } from '../../../application/use-cases/transactions/sync-offline-transactions.use-case';
import { CreateTransactionRequestDto } from '../../dto/transactions/create-transaction-request.dto';
import { OfflineSyncDto } from '../../../application/dto/sync/offline-sync.dto';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { InvalidSignatureException } from '../../../domain/exceptions/invalid-signature.exception';
import { InsufficientBalanceException } from '../../../domain/exceptions/insufficient-balance.exception';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionHistoryUseCase: GetTransactionHistoryUseCase,
    private readonly verifyTransactionUseCase: VerifyTransactionUseCase,
    private readonly syncOfflineTransactionsUseCase: SyncOfflineTransactionsUseCase,
  ) {}

  @Post()
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTransactionRequestDto) {
    try {
      return await this.createTransactionUseCase.execute(dto);
    } catch (error) {
      this.logger.error(`Error creating transaction: ${error.message}`, error.stack);
      
      if (error instanceof InvalidSignatureException) {
        throw new BadRequestException('Invalid transaction signature');
      }
      
      if (error instanceof InsufficientBalanceException) {
        throw new BadRequestException(error.message);
      }
      
      if (error.message?.includes('Customer not found')) {
        throw new BadRequestException('Customer not found');
      }
      
      if (error.message?.includes('Fraud detected')) {
        throw new BadRequestException(error.message);
      }
      
      throw new InternalServerErrorException(
        error.message || 'Failed to create transaction',
      );
    }
  }

  @Get('history/:customerId')
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  async getHistory(@Param('customerId') customerId: string) {
    return this.getTransactionHistoryUseCase.execute(customerId);
  }

  @Get('verify/:transactionId')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  async verify(@Param('transactionId') transactionId: string) {
    return this.verifyTransactionUseCase.execute(transactionId);
  }

  @Post('sync')
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async sync(@Body() dto: OfflineSyncDto) {
    return this.syncOfflineTransactionsUseCase.execute(dto);
  }
}
