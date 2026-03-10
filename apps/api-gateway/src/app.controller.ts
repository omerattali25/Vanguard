import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('vitals')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':patientId')
  getVitals(@Param('patientId') patientId: string) {
    return 'Hello World!';
  }

  @Post()
  recordVitals(@Body() data: any) {
    return 'Hello World!';
  }
}
