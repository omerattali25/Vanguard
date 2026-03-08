import { Module } from '@nestjs/common';
import { ExceptionalAlertsService } from './exceptional-alerts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from 'src/entity/alert.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Alert])],
    providers: [ExceptionalAlertsService]
})
export class AlertsModule { }
