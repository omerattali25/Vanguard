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
    @Body() dto: { lockId: string, patient: string},
  ) {
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

  @Put(':id')
  updateMachine(@Param('id') id:string,@Body() dto:{name?:string,location?:string}){
    return this.machinesService.updateMachine(id,dto.name,dto.location)
  }

  
}
