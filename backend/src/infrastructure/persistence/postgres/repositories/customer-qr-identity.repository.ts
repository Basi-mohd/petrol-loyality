import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerQrIdentity } from '../../../../domain/entities/customer-qr-identity.entity';
import { CustomerQrIdentityOrmEntity } from '../entities/customer-qr-identity.orm-entity';

export interface ICustomerQrIdentityRepository {
  save(identity: CustomerQrIdentity): Promise<void>;
  findById(id: string): Promise<CustomerQrIdentity | null>;
  findByQrToken(qrToken: string): Promise<CustomerQrIdentity | null>;
  findByCustomerId(customerId: string): Promise<CustomerQrIdentity[]>;
  findActiveByCustomerId(customerId: string): Promise<CustomerQrIdentity | null>;
  deactivateAllForCustomer(customerId: string): Promise<void>;
}

@Injectable()
export class CustomerQrIdentityRepository implements ICustomerQrIdentityRepository {
  constructor(
    @InjectRepository(CustomerQrIdentityOrmEntity)
    private readonly ormRepository: Repository<CustomerQrIdentityOrmEntity>,
  ) {}

  async save(identity: CustomerQrIdentity): Promise<void> {
    const ormEntity = this.toOrmEntity(identity);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<CustomerQrIdentity | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByQrToken(qrToken: string): Promise<CustomerQrIdentity | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { qrToken } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<CustomerQrIdentity[]> {
    const ormEntities = await this.ormRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async findActiveByCustomerId(customerId: string): Promise<CustomerQrIdentity | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { customerId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async deactivateAllForCustomer(customerId: string): Promise<void> {
    await this.ormRepository.update(
      { customerId, isActive: true },
      { isActive: false },
    );
  }

  private toOrmEntity(identity: CustomerQrIdentity): CustomerQrIdentityOrmEntity {
    const entity = new CustomerQrIdentityOrmEntity();
    entity.id = identity.id;
    entity.customerId = identity.customerId;
    entity.qrToken = identity.qrToken;
    entity.isActive = identity.isActive;
    entity.createdAt = identity.createdAt;
    entity.expiresAt = identity.expiresAt;
    return entity;
  }

  private toDomainEntity(ormEntity: CustomerQrIdentityOrmEntity): CustomerQrIdentity {
    return CustomerQrIdentity.reconstruct(
      ormEntity.id,
      ormEntity.customerId,
      ormEntity.qrToken,
      ormEntity.isActive,
      ormEntity.createdAt,
      ormEntity.expiresAt,
    );
  }
}
