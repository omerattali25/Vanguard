import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Machine, Patient } from '@vanguard/types';
import { IsNull, Not, Repository } from 'typeorm';
import { Recommendation } from '@vanguard/types';

@Injectable()
export class RecommendationsService {
  private readonly redis;
  constructor(
    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
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

    return machines.map((m) => m.assigned);
  }

  public async getPatientMapFromRedisRange(
    raw: string[],
  ): Promise<Map<string, string>> {
    const ids: string[] = raw.filter((_, i) => i % 2 === 0);
    const patients = await this.patientRepo.findByIds(ids);
    return new Map(patients.map((p) => [p.id, p.name]));
  }

  private async makeRecommendationsFromList(raw: string[]) {
    const idToName = await this.getPatientMapFromRedisRange(raw);

    const recommendations: Recommendation[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      const id = raw[i];
      const score = parseFloat(raw[i + 1]);
      const name = idToName.get(id) ?? 'Unknown';
      recommendations.push({ id: id, score: score, name: name });
    }
    return recommendations;
  }

  private async filterMachines(patients: Recommendation[]) {
    const patientIds = await this.getPatientsInMachines();
    const assignedIds = new Set(patientIds);

    return patients.filter((r) => !assignedIds.has(r.id));
  }

  async getTopRecommendations() {
    const raw = await this.redis.zrevrange(
      'riskIndex',
      0,
      parseInt(process.env.MAX_PATIENTS || '5'),
      'WITHSCORES',
    );

    const entries = await this.makeRecommendationsFromList(raw);

    const filteredEntries = await this.filterMachines(entries);

    return filteredEntries;
  }
}
