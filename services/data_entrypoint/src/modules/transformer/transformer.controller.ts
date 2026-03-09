import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransformerService } from './transformer.service';
import { VitalsInput } from './inputs/vitals.input';


@Controller()
export class TransformerController {
  constructor(private readonly appService: TransformerService) { }

  @EventPattern(process.env.LISTEN_TOPIC ?? "")
  handleVitals(@Payload() message: VitalsInput) {
    this.appService.handleVitals(message)
  }
}