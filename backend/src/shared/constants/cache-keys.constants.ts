export const CACHE_KEYS = {
  CUSTOMER: (id: string) => `customer:${id}`,
  TRANSACTION: (id: string) => `transaction:${id}`,
  LEDGER_ENTRY: (id: string) => `ledger:${id}`,
  CUSTOMER_BALANCE: (id: string) => `balance:${id}`,
  FRAUD_CHECK: (customerId: string) => `fraud:${customerId}`,
} as const;
