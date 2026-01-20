export declare const CACHE_KEYS: {
    readonly CUSTOMER: (id: string) => string;
    readonly TRANSACTION: (id: string) => string;
    readonly LEDGER_ENTRY: (id: string) => string;
    readonly CUSTOMER_BALANCE: (id: string) => string;
    readonly FRAUD_CHECK: (customerId: string) => string;
};
