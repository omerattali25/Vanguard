import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import configuration from '../config/alerts.config.json';
import { AlertsConfiguration } from 'src/config/alerts.config';
import { PatientVitals } from 'src/input/patient-vitals.input';
import { ExceptionalAlertsService } from 'src/alerts/exceptional-alerts.service';

let config: AlertsConfiguration = configuration;

@Controller()
export class KafkaController {
    constructor(private exceptionalAlertsService: ExceptionalAlertsService) {}

    @EventPattern(config.listenTopic)
    async handleVitalCreated(
        @Payload() vitals: PatientVitals,
        @Ctx() context: KafkaContext,
    ) {
        this.exceptionalAlertsService.checkVitals(vitals)
    }
}