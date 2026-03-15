import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from '@vanguard/types';
import { KafkaController } from 'src/kafka/kafka.consumer.controller';
import { AlertsService } from './alerts.service';
import { AverageVitalService } from './average-vital.service';
@Module({
    imports: [TypeOrmModule.forFeature([Alert])],
    controllers: [KafkaController],
    providers: [AlertsService, AverageVitalService]
})
export class AlertsModule { }

