"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumber = void 0;
class PhoneNumber {
    constructor(value) {
        this.value = value;
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10 || cleaned.length > 15) {
            throw new Error('Invalid phone number format');
        }
    }
    static create(value) {
        return new PhoneNumber(value);
    }
    getValue() {
        return this.value;
    }
    getCleaned() {
        return this.value.replace(/\D/g, '');
    }
    equals(other) {
        return this.getCleaned() === other.getCleaned();
    }
}
exports.PhoneNumber = PhoneNumber;
//# sourceMappingURL=phone-number.vo.js.map