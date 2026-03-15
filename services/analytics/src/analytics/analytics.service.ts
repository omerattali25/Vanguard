import { Injectable } from '@nestjs/common';
<<<<<<< HEAD
import { InjectRepository } from '@nestjs/typeorm';
import { MachineAction } from '@vanguard/types';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(MachineAction)
    private readonly machineActionRepo: Repository<MachineAction>,
  ) {}
}
=======

@Injectable()
export class AnalyticsService {}
>>>>>>> 62e9af8c829d3e752288563af6a6bb957501c957
