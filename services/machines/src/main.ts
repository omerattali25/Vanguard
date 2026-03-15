import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
     logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console(),

          new winston.transports.DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'app',
          }),

          new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
          }),
        ],
      })
  });
  app.enableCors();
  await app.listen(parseInt(process.env.MACHINES_SERVICE_PORT || '') || 3005);
  
}

bootstrap();
