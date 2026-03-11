import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';
import { Alert } from 'src/inputs/alert.input';
import { Machine } from 'src/inputs/machine.input';
import { Vitals } from 'src/inputs/vitals.input';

@Controller('pubsub')
export class PubsubController {
  @EventPattern('vitals')
  async onVitals(@Payload() vitals: Vitals) {
    console.log('Received vitals data:', vitals);
  }

  @EventPattern('alerts')
  onAlerts(@Payload() alert: Alert) {
    console.log('Received alerts data:', alert);
  }

  @EventPattern('machines')
  onMachine(@Payload() machine: Machine) {
    console.log('Received machine data:', machine.assigned);
  }
}
