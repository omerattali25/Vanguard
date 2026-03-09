import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from '@nestjs/microservices';
console.log(
  'REDIS URL:',
  `redis://${process.env.REDIS_CLIENT_HOST}:${process.env.REDIS_CLIENT_PORT}`
);

console.log('CWD:', process.cwd());
console.log('ENV BEFORE NEST:', process.env.DB_HOST);
async function bootstrap() {
  console.log('DB CONFIG:', {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    
    AppModule,
    {
       transport:Transport.TCP,
       options:{
        port:parseInt(process.env.MACHINES_SERVICE_PORT||'')||0
       }
    }

  );
  await app.listen();
}
bootstrap();
