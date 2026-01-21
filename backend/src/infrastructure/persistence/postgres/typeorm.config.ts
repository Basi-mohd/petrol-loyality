import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const createDataSource = (configService: ConfigService): DataSource => {
  const host = configService.get<string>('database.host') || 'localhost';
  const isProduction = configService.get<string>('environment') === 'production';

  const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host,
    port: configService.get<number>('database.port') || 5432,
    username: configService.get<string>('database.username') || 'postgres',
    password: configService.get<string>('database.password') || 'postgres',
    database: configService.get<string>('database.database') || 'petrol_loyalty',
    entities: [__dirname + '/entities/**/*.orm-entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    logging: configService.get<string>('environment') === 'development',
    ssl: isProduction || host !== 'localhost' ? { rejectUnauthorized: false } : false,
  };
  return new DataSource(dataSourceOptions);
};
