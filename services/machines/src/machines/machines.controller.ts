  import { Controller, Get, Param, Post, Put } from '@nestjs/common';
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

    @Post('change-patient/:id')
    async startChangePatient(@Param('id') machine: string) {
      return await this.machinesService.startChangePatient(machine);
    }

    @Put('change-patient/:id')
    async changePatient(@Param('id') machineId: string, @Payload() changePatientDto: MachineChangePatientDto) {
      return await this.machinesService.changePatient(
        machineId,
        changePatientDto.patient,
        changePatientDto.lockID
      );
    }
    @Post()
    async saveMachine(@Payload() machineInputDto) {
      return await this.machinesService.saveMachine(machineInputDto);
    }
  }
