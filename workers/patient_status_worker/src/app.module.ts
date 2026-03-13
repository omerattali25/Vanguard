import { Module } from '@nestjs/common';
import { StatusWorkerModule } from './status-worker/status-worker.module';

@Module({
  imports: [StatusWorkerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
