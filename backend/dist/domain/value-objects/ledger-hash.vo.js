"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerHash = void 0;
class LedgerHash {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('Hash cannot be empty');
        }
        if (!/^[a-f0-9]{64}$/i.test(value)) {
            throw new Error('Invalid hash format');
        }
    }
    static create(value) {
        return new LedgerHash(value);
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
}
exports.LedgerHash = LedgerHash;
//# sourceMappingURL=ledger-hash.vo.js.map