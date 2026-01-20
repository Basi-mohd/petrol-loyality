import { PhoneNumber } from '../value-objects/phone-number.vo';
import { Amount } from '../value-objects/amount.vo';
export declare class Customer {
    readonly id: string;
    readonly phoneNumber: PhoneNumber;
    readonly name: string;
    readonly balance: Amount;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly isActive: boolean;
    private constructor();
    static create(id: string, phoneNumber: PhoneNumber, name: string, initialBalance?: Amount): Customer;
    static reconstruct(id: string, phoneNumber: PhoneNumber, name: string, balance: Amount, createdAt: Date, updatedAt: Date, isActive: boolean): Customer;
    credit(amount: Amount): Customer;
    debit(amount: Amount): Customer;
    deactivate(): Customer;
    activate(): Customer;
}
