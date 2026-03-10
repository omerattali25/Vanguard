import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'VITALS_SERVICE',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              port: configService.get('VITALS_SERVICE_PORT') ?? 50051,
              host: configService.get('VITALS_SERVICE_HOST') ?? 'localhost',
            },
          }),
          inject: [ConfigService],
        },
      ],
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
