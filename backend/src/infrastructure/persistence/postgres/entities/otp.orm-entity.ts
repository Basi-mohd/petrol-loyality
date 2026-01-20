import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('otps')
@Index(['phoneNumber', 'deviceId'])
@Index(['phoneNumber', 'createdAt'])
export class OtpOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 20 })
  phoneNumber: string;

  @Column('varchar', { length: 6 })
  code: string;

  @Column('varchar', { length: 255 })
  deviceId: string;

  @Column('timestamp')
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  verifiedAt: Date | null;

  @Column('integer', { default: 0 })
  attempts: number;

  @Column('boolean', { default: false })
  isVerified: boolean;
}
