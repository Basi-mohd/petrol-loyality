import { Amount } from '../value-objects/amount.vo';
export declare class LoyaltyAccount {
    readonly id: string;
    readonly customerId: string;
    readonly points: number;
    readonly totalSpent: Amount;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    static create(customerId: string, initialPoints?: number): LoyaltyAccount;
    static reconstruct(id: string, customerId: string, points: number, totalSpent: Amount, createdAt: Date, updatedAt: Date): LoyaltyAccount;
    addPoints(points: number, amount: Amount): LoyaltyAccount;
    redeemPoints(points: number): LoyaltyAccount;
}
