"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const amount_vo_1 = require("../value-objects/amount.vo");
class Customer {
    constructor(id, phoneNumber, name, balance, createdAt, updatedAt, isActive) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.balance = balance;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
    }
    static create(id, phoneNumber, name, initialBalance = amount_vo_1.Amount.create(0)) {
        const now = new Date();
        return new Customer(id, phoneNumber, name, initialBalance, now, now, true);
    }
    static reconstruct(id, phoneNumber, name, balance, createdAt, updatedAt, isActive) {
        return new Customer(id, phoneNumber, name, balance, createdAt, updatedAt, isActive);
    }
    credit(amount) {
        return new Customer(this.id, this.phoneNumber, this.name, this.balance.add(amount), this.createdAt, new Date(), this.isActive);
    }
    debit(amount) {
        if (this.balance.isGreaterThan(amount) || this.balance.equals(amount)) {
            return new Customer(this.id, this.phoneNumber, this.name, this.balance.subtract(amount), this.createdAt, new Date(), this.isActive);
        }
        throw new Error('Insufficient balance');
    }
    deactivate() {
        return new Customer(this.id, this.phoneNumber, this.name, this.balance, this.createdAt, new Date(), false);
    }
    activate() {
        return new Customer(this.id, this.phoneNumber, this.name, this.balance, this.createdAt, new Date(), true);
    }
}
exports.Customer = Customer;
//# sourceMappingURL=customer.entity.js.map