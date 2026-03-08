import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Controller()
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @MessagePattern('createMachine')
  create(@Payload() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @MessagePattern('findAllMachines')
  findAll() {
    return this.machinesService.findAll();
  }

  @MessagePattern('findOneMachine')
  findOne(@Payload() id: number) {
    return this.machinesService.findOne(id);
  }

  @MessagePattern('updateMachine')
  update(@Payload() updateMachineDto: UpdateMachineDto) {
    return this.machinesService.update(updateMachineDto.id, updateMachineDto);
  }

  @MessagePattern('removeMachine')
  remove(@Payload() id: number) {
    return this.machinesService.remove(id);
  }
}
