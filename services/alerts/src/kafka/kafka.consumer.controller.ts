import {Controller} from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { PatientVitals } from '../alerts/input/patient-vitals.input';
import { AlertsService } from '../alerts/alerts.service';

@Controller()
export class KafkaController {
    constructor(private exceptionalAlertsService: AlertsService) { }

    @EventPattern(process.env.KAFKA_LISTEN_TOPIC)
    async handleVitalCreated(
        @Payload() vitals: PatientVitals,
        @Ctx() context: KafkaContext,
    ) {
        return await this.exceptionalAlertsService.checkVitals(vitals)
    }
}
