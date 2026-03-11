import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusWorkerModule } from './status-worker/status-worker.module';

@Module({
  imports: [StatusWorkerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
