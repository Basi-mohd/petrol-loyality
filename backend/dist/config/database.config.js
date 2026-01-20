"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    entities: [__dirname + '/../infrastructure/persistence/postgres/entities/**/*.orm-entity{.ts,.js}'],
    migrations: [__dirname + '/../infrastructure/persistence/postgres/migrations/**/*{.ts,.js}'],
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    synchronize: false,
    logging: configService.get('environment') === 'development',
    migrationsRun: false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map