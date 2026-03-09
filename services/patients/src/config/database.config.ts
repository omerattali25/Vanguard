import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const db_patients_config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT||"") || 0,
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',

    autoLoadEntities: true,
    synchronize: true,
};