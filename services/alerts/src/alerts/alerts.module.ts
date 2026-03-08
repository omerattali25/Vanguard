import { Module } from '@nestjs/common';
import { ExceptionalAlertsService } from './exceptional-alerts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from '../entity/alert.entity';
import { KafkaController } from 'src/kafka/kafka.consumer.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Alert])],
    controllers: [KafkaController],
    providers: [ExceptionalAlertsService]
})
export class AlertsModule { }
