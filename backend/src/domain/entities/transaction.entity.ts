import { Amount } from '../value-objects/amount.vo';
import { TransactionSignature } from '../value-objects/transaction-signature.vo';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { HashUtils } from '../../shared/utils/hash.utils';

export class Transaction {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly amount: Amount,
    public readonly type: TransactionType,
    public readonly status: TransactionStatus,
    public readonly signature: TransactionSignature,
    public readonly timestamp: Date,
    public readonly metadata: Record<string, any>,
    public readonly previousHash?: string,
    public readonly hash?: string,
  ) {}

  static create(
    customerId: string,
    amount: Amount,
    type: TransactionType,
    signature: TransactionSignature,
    metadata: Record<string, any> = {},
    previousHash?: string,
  ): Transaction {
    const id = HashUtils.generateId();
    const timestamp = new Date();
    const hash = previousHash
      ? HashUtils.createHashChain(
          previousHash,
          `${id}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`,
        )
      : HashUtils.sha256(
          `${id}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`,
        );

    return new Transaction(
      id,
      customerId,
      amount,
      type,
      TransactionStatus.PENDING,
      signature,
      timestamp,
      metadata,
      previousHash,
      hash,
    );
  }

  static reconstruct(
    id: string,
    customerId: string,
    amount: Amount,
    type: TransactionType,
    status: TransactionStatus,
    signature: TransactionSignature,
    timestamp: Date,
    metadata: Record<string, any>,
    previousHash?: string,
    hash?: string,
  ): Transaction {
    return new Transaction(
      id,
      customerId,
      amount,
      type,
      status,
      signature,
      timestamp,
      metadata,
      previousHash,
      hash,
    );
  }

  verifySignature(publicKey: string): boolean {
    return this.signature.getPublicKey() === publicKey;
  }

  markAsCompleted(): Transaction {
    return new Transaction(
      this.id,
      this.customerId,
      this.amount,
      this.type,
      TransactionStatus.COMPLETED,
      this.signature,
      this.timestamp,
      this.metadata,
      this.previousHash,
      this.hash,
    );
  }

  markAsFailed(): Transaction {
    return new Transaction(
      this.id,
      this.customerId,
      this.amount,
      this.type,
      TransactionStatus.FAILED,
      this.signature,
      this.timestamp,
      this.metadata,
      this.previousHash,
      this.hash,
    );
  }

  markAsSyncPending(): Transaction {
    return new Transaction(
      this.id,
      this.customerId,
      this.amount,
      this.type,
      TransactionStatus.SYNC_PENDING,
      this.signature,
      this.timestamp,
      this.metadata,
      this.previousHash,
      this.hash,
    );
  }

  markAsCancelled(): Transaction {
    return new Transaction(
      this.id,
      this.customerId,
      this.amount,
      this.type,
      TransactionStatus.CANCELLED,
      this.signature,
      this.timestamp,
      this.metadata,
      this.previousHash,
      this.hash,
    );
  }
}
