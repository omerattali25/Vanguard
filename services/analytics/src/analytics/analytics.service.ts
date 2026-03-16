import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MachineAction, MachineActionType, Patient } from '@vanguard/types';
import { Repository } from 'typeorm';

export enum MachineUsageRanking {
  MOST = 'DESC',
  LEAST = 'ASC',
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(MachineAction)
    private readonly machineActionRepo: Repository<MachineAction>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) { }

  async getAllMachineActions(): Promise<MachineAction[]> {
    return await this.machineActionRepo.find();
  }

  async getMachineByUsageRanking(ranking: MachineUsageRanking): Promise<Patient | null> {
    if (ranking === MachineUsageRanking.MOST) {
      return await this.getPatientByMachineUsageRanking(MachineUsageRanking.MOST);
    } else {
      return await this.getPatientByMachineUsageRanking(MachineUsageRanking.LEAST);
    }
  }

  async getPatientByMachineUsageRanking(ranking: MachineUsageRanking): Promise<Patient | null> {
    const result = await this.machineActionRepo.query(`
      SELECT patient_id
      FROM (
        SELECT patient_id,
               SUM(EXTRACT(EPOCH FROM (next_time - trigerd_at))) AS total_seconds
        FROM (
          SELECT patient_id,
                 action_type,
                 trigerd_at,
                 LEAD(trigerd_at) OVER (
                   PARTITION BY machine_id, patient_id
                   ORDER BY trigerd_at
                 ) AS next_time
          FROM machine_action
        ) actions
        WHERE action_type = '${MachineActionType.CONNECTED}'
        GROUP BY patient_id
        ORDER BY total_seconds ${ranking}
        LIMIT 1
      ) result
    `);

    if (!result.length) {
      return null;
    }

    return await this.patientRepository.findOne({
      where: { id: result[0].patient_id },
    });
  }
}
