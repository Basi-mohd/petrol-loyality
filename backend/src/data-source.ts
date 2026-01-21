import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'petrol_loyalty',
  entities: [path.join(__dirname, 'infrastructure/persistence/postgres/entities/**/*.orm-entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'infrastructure/persistence/postgres/migrations/**/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
  ssl:
    (process.env.NODE_ENV === 'production' ||
      (process.env.DB_HOST && process.env.DB_HOST !== 'localhost')) &&
    process.env.DB_SSL !== 'false'
      ? { rejectUnauthorized: false }
      : false,
});
