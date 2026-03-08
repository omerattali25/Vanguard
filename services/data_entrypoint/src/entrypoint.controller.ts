import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {EntryPointService } from './entrypoint.service';
import { VitalsBefore } from './inputs/vitals.input';


@Controller()
export class EntryPointController {
  constructor(private readonly appService: EntryPointService) {}

  @EventPattern (process.env.LISTEN_TOPIC??"")
  handleVital(@Payload() message: VitalsBefore) {
    this.appService.handleVitals(message)
  }
}