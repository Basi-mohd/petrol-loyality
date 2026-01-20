import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../../domain/interfaces/repositories/customer.repository.interface';
import { Customer } from '../../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { PhoneNumber } from '../../../../domain/value-objects/phone-number.vo';
import { Amount } from '../../../../domain/value-objects/amount.vo';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly ormRepository: Repository<CustomerOrmEntity>,
  ) {}

  async save(customer: Customer): Promise<void> {
    const ormEntity = this.toOrmEntity(customer);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<Customer | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByPhoneNumber(phoneNumber: PhoneNumber): Promise<Customer | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { phoneNumber: phoneNumber.getCleaned() },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findAll(): Promise<Customer[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async update(customer: Customer): Promise<void> {
    await this.save(customer);
  }

  private toOrmEntity(customer: Customer): CustomerOrmEntity {
    const entity = new CustomerOrmEntity();
    entity.id = customer.id;
    entity.phoneNumber = customer.phoneNumber.getCleaned();
    entity.name = customer.name;
    entity.balance = customer.balance.getValue();
    entity.isActive = customer.isActive;
    entity.createdAt = customer.createdAt;
    entity.updatedAt = customer.updatedAt;
    return entity;
  }

  private toDomainEntity(ormEntity: CustomerOrmEntity): Customer {
    const balanceValue = typeof ormEntity.balance === 'string' 
      ? parseFloat(ormEntity.balance) 
      : Number(ormEntity.balance);
    
    return Customer.reconstruct(
      ormEntity.id,
      PhoneNumber.create(ormEntity.phoneNumber),
      ormEntity.name,
      Amount.create(balanceValue),
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.isActive,
    );
  }
}
