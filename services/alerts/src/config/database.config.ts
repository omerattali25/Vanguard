import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const db_alerts_config : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mypassword',
    database: 'postgres',

    autoLoadEntities: true,
    synchronize: true,
};