import { LedgerHash } from '../value-objects/ledger-hash.vo';
import { Amount } from '../value-objects/amount.vo';
import { TransactionType } from '../enums/transaction-type.enum';
import { HashUtils } from '../../shared/utils/hash.utils';

export class LedgerEntry {
  private constructor(
    public readonly id: string,
    public readonly transactionId: string,
    public readonly customerId: string,
    public readonly amount: Amount,
    public readonly type: TransactionType,
    public readonly previousHash: LedgerHash | null,
    public readonly hash: LedgerHash,
    public readonly timestamp: Date,
    public readonly metadata: Record<string, any>,
  ) {}

  static create(
    transactionId: string,
    customerId: string,
    amount: Amount,
    type: TransactionType,
    previousHash: LedgerHash | null,
    metadata: Record<string, any> = {},
  ): LedgerEntry {
    const id = HashUtils.generateId();
    const timestamp = new Date();
    const hashValue = previousHash
      ? HashUtils.createHashChain(
          previousHash.getValue(),
          `${id}${transactionId}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`,
        )
      : HashUtils.sha256(
          `${id}${transactionId}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`,
        );

    return new LedgerEntry(
      id,
      transactionId,
      customerId,
      amount,
      type,
      previousHash,
      LedgerHash.create(hashValue),
      timestamp,
      metadata,
    );
  }

  static reconstruct(
    id: string,
    transactionId: string,
    customerId: string,
    amount: Amount,
    type: TransactionType,
    previousHash: LedgerHash | null,
    hash: LedgerHash,
    timestamp: Date,
    metadata: Record<string, any>,
  ): LedgerEntry {
    return new LedgerEntry(
      id,
      transactionId,
      customerId,
      amount,
      type,
      previousHash,
      hash,
      timestamp,
      metadata,
    );
  }

  verifyIntegrity(previousHash: LedgerHash | null): boolean {
    const expectedHash = previousHash
      ? HashUtils.createHashChain(
          previousHash.getValue(),
          `${this.id}${this.transactionId}${this.customerId}${this.amount.getValue()}${this.type}${this.timestamp.toISOString()}`,
        )
      : HashUtils.sha256(
          `${this.id}${this.transactionId}${this.customerId}${this.amount.getValue()}${this.type}${this.timestamp.toISOString()}`,
        );

    return this.hash.getValue() === expectedHash;
  }
}
