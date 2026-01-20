"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amount = void 0;
class Amount {
    constructor(value) {
        this.value = value;
        if (value < 0) {
            throw new Error('Amount cannot be negative');
        }
        if (!Number.isFinite(value)) {
            throw new Error('Amount must be a finite number');
        }
    }
    static create(value) {
        return new Amount(value);
    }
    getValue() {
        return this.value;
    }
    add(other) {
        return new Amount(this.value + other.value);
    }
    subtract(other) {
        if (this.value < other.value) {
            throw new Error('Insufficient balance');
        }
        return new Amount(this.value - other.value);
    }
    equals(other) {
        return this.value === other.value;
    }
    isGreaterThan(other) {
        return this.value > other.value;
    }
}
exports.Amount = Amount;
//# sourceMappingURL=amount.vo.js.map