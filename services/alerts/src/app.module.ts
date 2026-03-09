import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db_alerts_config } from './config/database.config';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [TypeOrmModule.forRoot(db_alerts_config), AlertsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
