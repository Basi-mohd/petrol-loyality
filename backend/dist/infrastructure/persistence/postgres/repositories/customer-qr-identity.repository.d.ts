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
export declare class CustomerQrIdentityRepository implements ICustomerQrIdentityRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<CustomerQrIdentityOrmEntity>);
    save(identity: CustomerQrIdentity): Promise<void>;
    findById(id: string): Promise<CustomerQrIdentity | null>;
    findByQrToken(qrToken: string): Promise<CustomerQrIdentity | null>;
    findByCustomerId(customerId: string): Promise<CustomerQrIdentity[]>;
    findActiveByCustomerId(customerId: string): Promise<CustomerQrIdentity | null>;
    deactivateAllForCustomer(customerId: string): Promise<void>;
    private toOrmEntity;
    private toDomainEntity;
}
