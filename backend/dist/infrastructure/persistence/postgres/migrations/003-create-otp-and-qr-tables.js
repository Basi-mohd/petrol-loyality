"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOtpAndQrTables1700000000003 = void 0;
class CreateOtpAndQrTables1700000000003 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE otps (
        id UUID PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL,
        code VARCHAR(6) NOT NULL,
        device_id VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        verified_at TIMESTAMP,
        attempts INTEGER DEFAULT 0 NOT NULL,
        is_verified BOOLEAN DEFAULT false NOT NULL
      );
    `);
        await queryRunner.query(`
      CREATE INDEX idx_otps_phone_device ON otps(phone_number, device_id);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_otps_phone_created ON otps(phone_number, created_at);
    `);
        await queryRunner.query(`
      CREATE TABLE customer_qr_identities (
        id UUID PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        qr_token VARCHAR(64) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        expires_at TIMESTAMP
      );
    `);
        await queryRunner.query(`
      CREATE INDEX idx_qr_customer_active ON customer_qr_identities(customer_id, is_active);
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX idx_qr_token_unique ON customer_qr_identities(qr_token);
    `);
        await queryRunner.query(`
      CREATE TABLE device_bindings (
        id UUID PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL,
        device_id VARCHAR(255) NOT NULL,
        device_fingerprint VARCHAR(255),
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(phone_number, device_id)
      );
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX idx_device_binding_unique ON device_bindings(phone_number, device_id);
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS device_bindings;`);
        await queryRunner.query(`DROP TABLE IF EXISTS customer_qr_identities;`);
        await queryRunner.query(`DROP TABLE IF EXISTS otps;`);
    }
}
exports.CreateOtpAndQrTables1700000000003 = CreateOtpAndQrTables1700000000003;
//# sourceMappingURL=003-create-otp-and-qr-tables.js.map