import { Module } from '@nestjs/common';
import { StatusWorkerController } from './status-worker.controller';
import { StatusWorkerService } from './status-worker.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Patient } from '@vanguard/types';
import { PatientStatusProvider } from './providers/patient-status-provider';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [StatusWorkerController],
  providers: [StatusWorkerService, PatientStatusProvider],
  exports: [StatusWorkerService, PatientStatusProvider],
})
export class StatusWorkerModule {}
