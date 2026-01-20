"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeesTable1700000000004 = void 0;
const bcrypt = __importStar(require("bcrypt"));
class CreateEmployeesTable1700000000004 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE employees (
        id UUID PRIMARY KEY,
        employee_id VARCHAR(50) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX idx_employees_employee_id ON employees(employee_id);
    `);
        const hashedPassword = await bcrypt.hash('123456', 10);
        const employeeId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
        await queryRunner.query(`INSERT INTO employees (id, employee_id, password_hash, name, is_active, created_at, updated_at)
       VALUES ('${employeeId}', 'PUMP_1', '${hashedPassword}', 'Pump Employee 1', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS employees;`);
    }
}
exports.CreateEmployeesTable1700000000004 = CreateEmployeesTable1700000000004;
//# sourceMappingURL=004-create-employees-table.js.map