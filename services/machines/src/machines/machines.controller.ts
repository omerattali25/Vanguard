import { Controller, Get, Put } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Payload } from '@nestjs/microservices';
import { MachineChangePatientDto } from './dto/machine.change.patient.dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async getMachines(){
    return await this.machinesService.getMachines();
  }

  @Put('change-patient')
  async changePatient(@Payload() changePatientDto:MachineChangePatientDto){
    await this.machinesService.changePatient(changePatientDto.id,changePatientDto.patient)
  }
}
