import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Payload } from '@nestjs/microservices';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  getPatients() {
    return this.machinesService.getMachines();
  }

  @Post(`/change-patient/:id`)
  startChangePatient(@Param('id') machineId: string) {
    return this.machinesService.startChangePatient(machineId);
  }

  @Put(`/change-patient/:id`)
  changePatient(
    @Param('id') machineId: string,
    @Body() dto: { patient: string; lockId: string },
  ) {
    console.log(dto.lockId);
    return this.machinesService.changePatient(
      machineId,
      dto.patient,
      dto.lockId,
    );
  }
  @Post()
  postMachine(@Body() dto: { name: string }) {
    return this.machinesService.saveMachine(dto.name);
  }
}
