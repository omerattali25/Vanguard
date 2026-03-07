import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import {AppConfiguration}  from "./other_types/AppConfiguration"
import configuration from "./app.config.json"

let appConfig:AppConfiguration = configuration;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern (appConfig.listenTopic)
  handleVital(@Payload() message: any) {
    this.appService.handleMessage(message)
  }
}