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
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path = __importStar(require("path"));
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
(0, dotenv_1.config)();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'petrol_loyalty',
    entities: [path.join(__dirname, 'infrastructure/persistence/postgres/entities/**/*.orm-entity{.ts,.js}')],
    migrations: [path.join(__dirname, 'infrastructure/persistence/postgres/migrations/**/*{.ts,.js}')],
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: false,
    ssl: (process.env.NODE_ENV === 'production' ||
        (process.env.DB_HOST && process.env.DB_HOST !== 'localhost')) &&
        process.env.DB_SSL !== 'false'
        ? { rejectUnauthorized: false }
        : false,
});
//# sourceMappingURL=data-source.js.map