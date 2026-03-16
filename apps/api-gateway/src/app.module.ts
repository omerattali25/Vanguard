import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VitalsModule } from './modules/vitals/vitals.module';
import { PatientsModule } from './modules/patients/patients.module';
import { MachinesModule } from './modules/machines/machines.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VitalsModule,
    PatientsModule,
    MachinesModule,
<<<<<<< HEAD
=======
    RecommendationsModule,
>>>>>>> c9a4b431bba50b2295897d66f9feb0b59067fd91
    AnalyticsModule
  ],
})
export class AppModule {}
