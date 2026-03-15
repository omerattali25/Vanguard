import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubsubModule } from './pubsub/pubsub.module';

@Module({
  imports: [PubsubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
