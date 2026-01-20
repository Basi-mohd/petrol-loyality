"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyAccount = void 0;
const amount_vo_1 = require("../value-objects/amount.vo");
class LoyaltyAccount {
    constructor(id, customerId, points, totalSpent, createdAt, updatedAt) {
        this.id = id;
        this.customerId = customerId;
        this.points = points;
        this.totalSpent = totalSpent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(customerId, initialPoints = 0) {
        const id = `loyalty-${customerId}`;
        const now = new Date();
        return new LoyaltyAccount(id, customerId, initialPoints, amount_vo_1.Amount.create(0), now, now);
    }
    static reconstruct(id, customerId, points, totalSpent, createdAt, updatedAt) {
        return new LoyaltyAccount(id, customerId, points, totalSpent, createdAt, updatedAt);
    }
    addPoints(points, amount) {
        return new LoyaltyAccount(this.id, this.customerId, this.points + points, this.totalSpent.add(amount), this.createdAt, new Date());
    }
    redeemPoints(points) {
        if (this.points < points) {
            throw new Error('Insufficient points');
        }
        return new LoyaltyAccount(this.id, this.customerId, this.points - points, this.totalSpent, this.createdAt, new Date());
    }
}
exports.LoyaltyAccount = LoyaltyAccount;
//# sourceMappingURL=loyalty-account.entity.js.map