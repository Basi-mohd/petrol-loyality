import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Otp } from '../../../../domain/entities/otp.entity';
import { OtpOrmEntity } from '../entities/otp.orm-entity';

export interface IOtpRepository {
  save(otp: Otp): Promise<void>;
  findById(id: string): Promise<Otp | null>;
  findLatestByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<Otp | null>;
  findRecentByPhone(phoneNumber: string, minutes: number): Promise<Otp[]>;
  deleteExpired(): Promise<void>;
}

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    @InjectRepository(OtpOrmEntity)
    private readonly ormRepository: Repository<OtpOrmEntity>,
  ) {}

  async save(otp: Otp): Promise<void> {
    const ormEntity = this.toOrmEntity(otp);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<Otp | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findLatestByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<Otp | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { phoneNumber, deviceId },
      order: { createdAt: 'DESC' },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findRecentByPhone(phoneNumber: string, minutes: number): Promise<Otp[]> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const ormEntities = await this.ormRepository.find({
      where: {
        phoneNumber,
        createdAt: MoreThan(cutoffTime) as any,
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async deleteExpired(): Promise<void> {
    await this.ormRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  private toOrmEntity(otp: Otp): OtpOrmEntity {
    const entity = new OtpOrmEntity();
    entity.id = otp.id;
    entity.phoneNumber = otp.phoneNumber;
    entity.code = otp.code;
    entity.deviceId = otp.deviceId;
    entity.expiresAt = otp.expiresAt;
    entity.createdAt = otp.createdAt;
    entity.verifiedAt = otp.verifiedAt;
    entity.attempts = otp.attempts;
    entity.isVerified = otp.isVerified;
    return entity;
  }

  private toDomainEntity(ormEntity: OtpOrmEntity): Otp {
    return Otp.reconstruct(
      ormEntity.id,
      ormEntity.phoneNumber,
      ormEntity.code,
      ormEntity.deviceId,
      ormEntity.expiresAt,
      ormEntity.createdAt,
      ormEntity.verifiedAt,
      ormEntity.attempts,
      ormEntity.isVerified,
    );
  }
}
