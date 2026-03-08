import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const db_patients_config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Admin123',
    database: 'vanguard_db',

    autoLoadEntities: true,
    synchronize: true,
};