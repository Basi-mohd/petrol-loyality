"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIndexes1700000000002 = void 0;
class CreateIndexes1700000000002 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE INDEX idx_customers_phone_number ON customers(phone_number);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_transactions_customer_id_timestamp ON transactions(customer_id, timestamp);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_transactions_status ON transactions(status);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_ledger_entries_customer_id_timestamp ON ledger_entries(customer_id, timestamp);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_ledger_entries_transaction_id ON ledger_entries(transaction_id);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_audit_logs_user_id_timestamp ON audit_logs(user_id, timestamp);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_audit_logs_resource_timestamp ON audit_logs(resource, resource_id, timestamp);
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_audit_logs_resource_timestamp;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_audit_logs_user_id_timestamp;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_ledger_entries_transaction_id;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_ledger_entries_customer_id_timestamp;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_status;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_customer_id_timestamp;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_phone_number;`);
    }
}
exports.CreateIndexes1700000000002 = CreateIndexes1700000000002;
//# sourceMappingURL=002-create-indexes.js.map