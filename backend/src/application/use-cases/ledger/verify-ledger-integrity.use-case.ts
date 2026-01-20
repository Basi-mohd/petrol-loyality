import { Injectable, Inject } from '@nestjs/common';
import { ILedgerRepository } from '../../../domain/interfaces/repositories/ledger.repository.interface';

@Injectable()
export class VerifyLedgerIntegrityUseCase {
  constructor(
    @Inject('ILedgerRepository')
    private readonly ledgerRepository: ILedgerRepository,
  ) {}

  async execute(): Promise<boolean> {
    return this.ledgerRepository.verifyIntegrity();
  }
}
