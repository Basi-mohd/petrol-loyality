"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLedgerTables1700000000001 = void 0;
class CreateLedgerTables1700000000001 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE transaction_type_enum AS ENUM ('CREDIT', 'DEBIT', 'REFUND');
      CREATE TYPE transaction_status_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'SYNC_PENDING');
    `);
        await queryRunner.query(`
      CREATE TABLE customers (
        id UUID PRIMARY KEY,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
        await queryRunner.query(`
      CREATE TABLE transactions (
        id UUID PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type transaction_type_enum NOT NULL,
        status transaction_status_enum NOT NULL,
        signature TEXT NOT NULL,
        public_key TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        metadata JSONB,
        previous_hash TEXT,
        hash TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
        await queryRunner.query(`
      CREATE TABLE ledger_entries (
        id UUID PRIMARY KEY,
        transaction_id UUID UNIQUE NOT NULL,
        customer_id UUID NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type transaction_type_enum NOT NULL,
        previous_hash TEXT,
        hash TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
        await queryRunner.query(`
      CREATE TABLE audit_logs (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        user_role VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id UUID NOT NULL,
        details JSONB,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
        ip_address VARCHAR(45)
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS audit_logs;`);
        await queryRunner.query(`DROP TABLE IF EXISTS ledger_entries;`);
        await queryRunner.query(`DROP TABLE IF EXISTS transactions;`);
        await queryRunner.query(`DROP TABLE IF EXISTS customers;`);
        await queryRunner.query(`DROP TYPE IF EXISTS transaction_status_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_enum;`);
    }
}
exports.CreateLedgerTables1700000000001 = CreateLedgerTables1700000000001;
//# sourceMappingURL=001-create-ledger-tables.js.map