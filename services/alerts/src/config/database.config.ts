import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const db_alerts_config : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Qq321321',
    database: 'vanguard_db',

    autoLoadEntities: true,
    synchronize: true,
};