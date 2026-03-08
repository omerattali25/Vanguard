import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {EntryPointService } from './entrypoint.service';
import {AppConfiguration}  from "./config_types/AppConfiguration"
import configuration from "./app.config.json"
import { VitalsBefore } from './inputs/vitals.input';
let appConfig:AppConfiguration = configuration;

@Controller()
export class EntryPointController {
  constructor(private readonly appService: EntryPointService) {}

  @EventPattern (appConfig.listenTopic)
  handleVital(@Payload() message: VitalsBefore) {
    this.appService.handleVitals(message)
  }
}