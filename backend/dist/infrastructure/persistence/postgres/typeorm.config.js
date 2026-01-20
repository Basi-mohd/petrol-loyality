"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataSource = void 0;
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const createDataSource = (configService) => {
    const dataSourceOptions = {
        type: 'postgres',
        host: configService.get('database.host') || 'localhost',
        port: configService.get('database.port') || 5432,
        username: configService.get('database.username') || 'postgres',
        password: configService.get('database.password') || 'postgres',
        database: configService.get('database.database') || 'petrol_loyalty',
        entities: [__dirname + '/entities/**/*.orm-entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
        synchronize: false,
        logging: configService.get('environment') === 'development',
    };
    return new typeorm_1.DataSource(dataSourceOptions);
};
exports.createDataSource = createDataSource;
//# sourceMappingURL=typeorm.config.js.map