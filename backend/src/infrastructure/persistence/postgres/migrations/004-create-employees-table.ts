import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateEmployeesTable1700000000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(
      `INSERT INTO employees (id, employee_id, password_hash, name, is_active, created_at, updated_at)
       VALUES ('${employeeId}', 'PUMP_1', '${hashedPassword}', 'Pump Employee 1', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS employees;`);
  }
}
