import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsConfiguration } from './config/alerts.config';
import configuration from "./config/alerts.config.json"
import { TypeOrmModule } from '@nestjs/typeorm';
import { db_alerts_config } from './config/database.config';
import { AlertsModule } from './alerts/alerts.module';

const config: AlertsConfiguration = configuration;
@Module({
  imports: [TypeOrmModule.forRoot(db_alerts_config), AlertsModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule { }
