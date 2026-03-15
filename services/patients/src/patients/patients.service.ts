import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient, PatientDetails } from '@vanguard/types';
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

    private logger = new Logger(PatientsService.name);

    async getPatientById(patient_id: string): Promise<Patient> {
        const patient = await this.patientRepo.findOne({ where: { id: patient_id } });
        if (!patient) {
            this.logger.warn(`Patient with ID ${patient_id} not found`);
            throw new NotFoundException(`Patient with ID ${patient_id} not found`);
        }
        this.logger.log(`Fetched patient with ID ${patient_id}`);
        return patient;
    }

    async getPatients(): Promise<Patient[]> {
        this.logger.log('Fetching all patients');
        return await this.patientRepo.find();
    }

    async createPatient(patient: PatientDetails): Promise<Patient> {
        this.logger.log(`Creating patient with ID ${patient.patient_id}`);
        const newPatient = this.patientRepo.create(patient);
        await this.redis.publish(`patients`, JSON.stringify(newPatient));
        return await this.patientRepo.save(newPatient);
    }

}
