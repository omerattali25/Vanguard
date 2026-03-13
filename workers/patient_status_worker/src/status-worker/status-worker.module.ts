import { Module } from '@nestjs/common';
import { StatusWorkerController } from './status-worker.controller';
import { StatusWorkerService } from './status-worker.service';

@Module({
  imports: [],
  controllers: [StatusWorkerController],
  providers: [StatusWorkerService],
})
export class StatusWorkerModule {}
