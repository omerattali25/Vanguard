import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

@Module({
  imports: [HttpModule],
  controllers: [MachinesController],
  providers: [MachinesService],
})
export class MachinesModule {}
