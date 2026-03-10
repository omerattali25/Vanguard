import { Controller, Get, Post, Put } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Payload } from '@nestjs/microservices';
import { MachineChangePatientDto } from './dto/machine.change.patient.dto';
import { cwd } from 'process';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async getMachines() {
    return await this.machinesService.getMachines();
  }

  @Put('change-patient')
  async changePatient(@Payload() changePatientDto: MachineChangePatientDto) {
    await this.machinesService.changePatient(
      changePatientDto.id,
      changePatientDto.patient,
    );
  }
  @Post()
  async saveMachine(@Payload() machineInputDto) {
    return await this.machinesService.saveMachine(machineInputDto);
  }
}
