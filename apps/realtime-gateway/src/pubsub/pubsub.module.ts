import { Module } from '@nestjs/common';
import { SocketGateway } from 'src/websocket/socket.gateway';
import { PubsubController } from './pubsub.controller';

@Module({
  controllers: [PubsubController],
  providers: [PubsubService, SocketGateway],
  exports: [PubsubService],
})
export class PubsubModule {}
