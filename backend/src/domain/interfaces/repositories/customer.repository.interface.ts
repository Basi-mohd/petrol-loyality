import { Customer } from '../../entities/customer.entity';
import { PhoneNumber } from '../../value-objects/phone-number.vo';

export interface ICustomerRepository {
  save(customer: Customer): Promise<void>;
  findById(id: string): Promise<Customer | null>;
  findByPhoneNumber(phoneNumber: PhoneNumber): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(customer: Customer): Promise<void>;
}
