import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VitalsModule } from './modules/vitals/vitals.module';
import { PatientsModule } from './modules/patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VitalsModule,
    PatientsModule,
  ],
})
export class AppModule {}
