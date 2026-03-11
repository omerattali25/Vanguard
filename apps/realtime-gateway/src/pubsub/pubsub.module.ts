import { Module } from '@nestjs/common';
import { PubsubController } from './pubsub.controller';
import { PubsubService } from './pubsub.service';

@Module({
  controllers: [PubsubController],
  providers: [PubsubService],
  exports: [PubsubService],
})
export class PubsubModule {}
