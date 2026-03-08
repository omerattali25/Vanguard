import { Body, Controller, Post } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import configuration from '../config/alerts.config.json';
import { AlertsConfiguration } from '../config/alerts.config';
import { PatientVitals } from '../input/patient-vitals.input';
import { ExceptionalAlertsService } from '../alerts/exceptional-alerts.service';
import { VitalField } from 'src/entity/alert.entity';

let config: AlertsConfiguration = configuration;

@Controller()
export class KafkaController {
    constructor(private exceptionalAlertsService: ExceptionalAlertsService) { }

    @EventPattern(config.listenTopic)
    async handleVitalCreated(
        @Payload() vitals: PatientVitals,
        @Ctx() context: KafkaContext,
    ) {
        return await this.exceptionalAlertsService.checkVitals(vitals)
    }

    @Post()
    async addAlert(@Body() body: PatientVitals) {
        return await this.exceptionalAlertsService.createNewAlert(body, VitalField.HeartRate, true);
    }
}
