import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Alert } from 'src/inputs/alert.input';
import { Machine } from 'src/inputs/machine.input';
import { Vitals } from 'src/inputs/vitals.input';
import { SocketGateway } from 'src/websocket/socket.gateway';

@Controller('pubsub')
export class PubsubController {
  constructor(private readonly socket: SocketGateway) {}

  @EventPattern('vitals')
  async onVitals(@Payload() vitals: Vitals) {
    this.socket.emitToRoom(`vitals:${vitals.patient_id}`, 'vitals', vitals);
  }

  @EventPattern('alerts')
  onAlerts(@Payload() alert: Alert) {
    console.log(alert);
    this.socket.emitToRoom(`alerts`, 'alerts', alert);
  }

  @EventPattern('machines')
  onMachine(@Payload() machine: Machine) {
    console.log(machine);

    this.socket.emitToRoom(`machines`, 'machines', machine);
  }
}
