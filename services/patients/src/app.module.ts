import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { db_patients_config } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(db_patients_config), PatientsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
