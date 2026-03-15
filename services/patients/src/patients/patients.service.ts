import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient, PatientDetails, PatientStatus } from '@vanguard/types';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';

@Injectable()
export class PatientsService {
    private readonly redis: Redis
    constructor(
        @InjectRepository(Patient)
        private patientRepo: Repository<Patient>,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {
        const namespace = this.configService.get<string>('REDIS_NAMESPACE');
        this.redis = this.redisService.getOrThrow(namespace);
    }

    async getPatientById(patient_id: string): Promise<Patient> {
        const patient = await this.patientRepo.findOne({ where: { id: patient_id } });
        if (!patient) {
            throw new NotFoundException(`Patient with ID ${patient_id} not found`);
        }
        return patient;
    }

    async getPatients(): Promise<Patient[]> {
        return await this.patientRepo.find();
    }

    async createPatient(patient: PatientDetails): Promise<Patient> {
<<<<<<< HEAD
        const newPatient = this.patientRepo.create({ ...patient, status: PatientStatus.Stable });
=======
        const newPatient = this.patientRepo.create(patient);
        await this.redis.publish(`patients`, JSON.stringify(newPatient));
>>>>>>> bcdcd135aa9a344e5820bc58e0e075edc9dea84e
        return await this.patientRepo.save(newPatient);
    }

}
