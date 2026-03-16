import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Payload } from '@nestjs/microservices';
import { MachineChangePatientDto } from './dto/machine.change.patient.dto';
import { MachineInputDto } from './dto/machine.input.dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) { }

  @Get()
  async getMachines() {
    return await this.machinesService.getMachines();
  }

  @Post('change-patient/:id')
  async startChangePatient(@Param('id') machine: string) {
    return await this.machinesService.startChangePatient(machine);
  }

  @Put('change-patient/:id')
  async changePatient(
    @Param('id') id: string,
    @Body() changePatientDto: MachineChangePatientDto,
  ) {
    return await this.machinesService.changePatient(
     id,
      changePatientDto.patient,
      changePatientDto.lockID,
    );
  }

  @Post()
  async saveMachine(@Body() machineInputDto:MachineInputDto) {
    return await this.machinesService.saveMachine(machineInputDto);
  }

  @Put(':id')
  async updateMachine(@Param('id') machineId: string, @Body() machineUpdateDto: any) {
    return await this.machinesService.updateMachine(machineId, machineUpdateDto);
  }
}
