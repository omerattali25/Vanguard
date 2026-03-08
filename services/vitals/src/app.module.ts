import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IngestionModule } from './modules/ingestion/ingestion.module';

@Module({
  imports: [IngestionModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
