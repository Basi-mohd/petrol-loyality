import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('employees')
@Index(['employeeId'], { unique: true })
export class EmployeeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  employeeId: string;

  @Column('varchar', { length: 255 })
  passwordHash: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
