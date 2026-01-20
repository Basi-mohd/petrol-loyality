import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../../../domain/interfaces/repositories/customer.repository.interface';
import { Customer } from '../../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { PhoneNumber } from '../../../../domain/value-objects/phone-number.vo';
export declare class CustomerRepository implements ICustomerRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<CustomerOrmEntity>);
    save(customer: Customer): Promise<void>;
    findById(id: string): Promise<Customer | null>;
    findByPhoneNumber(phoneNumber: PhoneNumber): Promise<Customer | null>;
    findAll(): Promise<Customer[]>;
    update(customer: Customer): Promise<void>;
    private toOrmEntity;
    private toDomainEntity;
}
