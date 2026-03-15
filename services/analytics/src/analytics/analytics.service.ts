import { Injectable } from '@nestjs/common';
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
