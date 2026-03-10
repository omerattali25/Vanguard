import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Machine } from 'src/entities/machine.entity';
import { IsNull, Not, Repository } from 'typeorm';
@Injectable()
export class RecommendationsService {
  private readonly redis;
  constructor(
    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '',
      port: parseInt(process.env.REDIS_PORT || '1'),
    });
  }

  private async getPatientsInMachines() {
    const machines = await this.machineRepo.find({
      select: ['assigned'],
      where: {
        assigned: Not(IsNull()),
      },
    });
    return machines;
  }

  private makeJsonFromList(raw: string[]) {
    const entries = raw.reduce(
      (acc, val, i) => {
        if (i % 2 === 0) acc[val] = parseFloat(raw[i + 1]);
        return acc;
      },
      {} as Record<string, number>,
    );
    return entries;
  }

  private async filterMachines(patients: Record<string, number>) {
    const machines = await this.getPatientsInMachines();
    const assignedIds = new Set(machines.map((m) => m.assigned));

    return Object.fromEntries(
      Object.entries(patients).filter(([id]) => !assignedIds.has(id)),
    );
  }

  async getTopRecommendations() {
    const raw = await this.redis.zrevrange(
      'riskIndex',
      0,
      parseInt(process.env.MAX_PATIENTS || '5'),
      'WITHSCORES',
    );

    const entries = this.makeJsonFromList(raw);

    const filteredEntries = await this.filterMachines(entries);

    return filteredEntries;
  }
}
