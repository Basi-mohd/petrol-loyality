import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('customer_qr_identities')
@Index(['customerId', 'isActive'])
@Index(['qrToken'], { unique: true })
export class CustomerQrIdentityOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('varchar', { length: 64, unique: true })
  qrToken: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  expiresAt: Date | null;
}
