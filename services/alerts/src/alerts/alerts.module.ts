import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entity/alert.entity';
import { KafkaController } from 'src/kafka/kafka.consumer.controller';
import { AlertsService } from './alerts.service';
@Module({
    imports: [TypeOrmModule.forFeature([Alert])],
    controllers: [KafkaController],
    providers: [AlertsService]
})
export class AlertsModule { }

