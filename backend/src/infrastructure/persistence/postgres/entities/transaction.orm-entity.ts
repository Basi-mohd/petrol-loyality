import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('transactions')
@Index(['customerId', 'timestamp'])
@Index(['status'])
export class TransactionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  customerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['CREDIT', 'DEBIT', 'REFUND'] })
  type: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'SYNC_PENDING'],
  })
  status: string;

  @Column('text')
  signature: string;

  @Column('text')
  publicKey: string;

  @Column('timestamp')
  timestamp: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column('text', { nullable: true })
  previousHash: string;

  @Column('text', { nullable: true })
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
