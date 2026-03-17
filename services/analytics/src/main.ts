import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors({ origin: 'localhost:3000' });
  
  await app.listen(process.env.PORT ?? 3011);
}
bootstrap();
