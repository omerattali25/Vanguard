import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MachinesService } from './machines.service';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  getPatients() {
    return this.machinesService.getMachines();
  }
  @Post()
  saveMachine(name:string){
    return this.machinesService.saveMachine
  }
  @Post(`/changePatient/:machineId`)
  startChangePatient(@Param('machineId') machineId:string){
    return this.machinesService.startChangePatient(machineId)
  }
  @Put(`/changePatient/:machineId`)
  changePatient(@Param('machineId') machineId:string,@Body() lockId:string, patientId:string){
    return this.machinesService.changePatient(machineId,patientId,lockId)
  }

}
