import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransformerController } from './transformer.controller';
import { TransformerService } from './transformer.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_PRODUCER',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get('KAFKA_PRODUCING') || ''],
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransformerController],
  providers: [TransformerService],
})

export class TransformerModule {}