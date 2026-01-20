import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ledger_entries')
@Index(['customerId', 'timestamp'])
@Index(['transactionId'], { unique: true })
export class LedgerEntryOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  transactionId: string;

  @Column('uuid')
  @Index()
  customerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['CREDIT', 'DEBIT', 'REFUND'] })
  type: string;

  @Column('text', { nullable: true })
  previousHash: string;

  @Column('text')
  hash: string;

  @Column('timestamp')
  timestamp: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
