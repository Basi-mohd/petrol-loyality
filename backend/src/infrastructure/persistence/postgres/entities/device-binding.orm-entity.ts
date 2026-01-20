import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('device_bindings')
@Index(['phoneNumber', 'deviceId'], { unique: true })
export class DeviceBindingOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 20 })
  phoneNumber: string;

  @Column('varchar', { length: 255 })
  deviceId: string;

  @Column('varchar', { length: 255, nullable: true })
  deviceFingerprint: string | null;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
