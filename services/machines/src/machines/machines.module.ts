import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine } from '@vanguard/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { MachineAction } from './entity/machine.action.entity';
import {Patient} from '@vanguard/types';
@Module({
  imports: [TypeOrmModule.forFeature([Machine,MachineAction,Patient]),RedisModule],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService],
})
export class MachinesModule {}
