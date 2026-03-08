import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { db_patients_config } from './config/database.config';
import { PatientsService } from './patients/patients.service';

@Module({
  imports: [TypeOrmModule.forRoot(db_patients_config), PatientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
