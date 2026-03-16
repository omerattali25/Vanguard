import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VitalsModule } from './modules/vitals/vitals.module';
import { PatientsModule } from './modules/patients/patients.module';
import { MachinesModule } from './modules/machines/machines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VitalsModule,
    PatientsModule,
    MachinesModule
  ],
})
export class AppModule {}
