"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerQrIdentity = void 0;
class CustomerQrIdentity {
    constructor(id, customerId, qrToken, isActive, createdAt, expiresAt) {
        this.id = id;
        this.customerId = customerId;
        this.qrToken = qrToken;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
    static create(id, customerId, qrToken, expiresAt = null) {
        return new CustomerQrIdentity(id, customerId, qrToken, true, new Date(), expiresAt);
    }
    static reconstruct(id, customerId, qrToken, isActive, createdAt, expiresAt) {
        return new CustomerQrIdentity(id, customerId, qrToken, isActive, createdAt, expiresAt);
    }
    deactivate() {
        return new CustomerQrIdentity(this.id, this.customerId, this.qrToken, false, this.createdAt, this.expiresAt);
    }
    isExpired() {
        if (!this.expiresAt) {
            return false;
        }
        return new Date() > this.expiresAt;
    }
}
exports.CustomerQrIdentity = CustomerQrIdentity;
//# sourceMappingURL=customer-qr-identity.entity.js.map