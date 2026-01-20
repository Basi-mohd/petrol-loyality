import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppendLedgerEntryUseCase } from '../../../application/use-cases/ledger/append-ledger-entry.use-case';
import { VerifyLedgerIntegrityUseCase } from '../../../application/use-cases/ledger/verify-ledger-integrity.use-case';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../../domain/enums/user-role.enum';

@Controller('ledger')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LedgerController {
  constructor(
    private readonly appendLedgerEntryUseCase: AppendLedgerEntryUseCase,
    private readonly verifyLedgerIntegrityUseCase: VerifyLedgerIntegrityUseCase,
  ) {}

  @Post('append/:transactionId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async append(@Param('transactionId') transactionId: string) {
    await this.appendLedgerEntryUseCase.execute(transactionId);
    return { success: true };
  }

  @Get('verify-integrity')
  @Roles(UserRole.ADMIN)
  async verifyIntegrity() {
    const isValid = await this.verifyLedgerIntegrityUseCase.execute();
    return { isValid };
  }
}
