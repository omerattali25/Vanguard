// average-vital.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AverageVitalService } from './average-vital.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { VitalField } from './entity/alert.entity';
import { PatientVitals } from './input/patient-vitals.input';

describe('AverageVitalService', () => {
    let service: AverageVitalService;
    let redisMock: any;

    const TTL_DAYS = 3; // for tests

    beforeEach(async () => {
        redisMock = {
            hget: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AverageVitalService,
                {
                    provide: RedisService,
                    useValue: {
                        getOrThrow: () => redisMock,
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('default'),
                    },
                },
            ],
        }).compile();

        service = module.get<AverageVitalService>(AverageVitalService);
    });

    it('should return false if there is no previous data', async () => {
        redisMock.hget.mockResolvedValue(null);

        const vitals: PatientVitals = {
            id: 'a',
            patientId: '123',
            timestamp: new Date().toISOString(),
            heartRate: 80,
            spO2: 97,
            respiratoryRate: 97.5,
            bodyTemperature: 36.5
        };

        const result = await service.isVitalOutOfAverage(vitals, VitalField.HEART_RATE);
        expect(result).toBe(false);
    });

    it('should return false if deviation <= 20%', async () => {
        redisMock.hget.mockResolvedValueOnce('80')
            .mockResolvedValueOnce('82')
            .mockResolvedValueOnce('81');

        const vitals: PatientVitals = {
            id: 'a',
            patientId: '123',
            timestamp: new Date().toISOString(),
            heartRate: 82, // within 20% of average
            spO2: 97,
            respiratoryRate: 97.5,
            bodyTemperature: 36.5
        };

        const result = await service.isVitalOutOfAverage(vitals, VitalField.HEART_RATE);
        expect(result).toBe(false);
    });

    it('should return true if deviation > 20%', async () => {
        redisMock.hget.mockResolvedValueOnce('75')
            .mockResolvedValueOnce('76')
            .mockResolvedValueOnce('77');

        const vitals: PatientVitals = {
            id: 'a',
            patientId: '123',
            timestamp: new Date().toISOString(),
            heartRate: 99, // >20% above average ~76
            spO2: 97,
            respiratoryRate: 97.5,
            bodyTemperature: 36.5
        };

        const result = await service.isVitalOutOfAverage(vitals, VitalField.HEART_RATE);
        expect(result).toBe(true);
    });

    it('should correctly average multiple days', async () => {
        redisMock.hget
            .mockResolvedValueOnce('80')
            .mockResolvedValueOnce('82')
            .mockResolvedValueOnce('78');

        const vitals: PatientVitals = {
            id: 'a',
            patientId: '123',
            timestamp: new Date().toISOString(),
            heartRate: 100,
            spO2: 97,
            respiratoryRate: 97.5,
            bodyTemperature: 36.5
        };

        // avg = (80+82+78)/3 = 80
        const result = await service.isVitalOutOfAverage(vitals, VitalField.HEART_RATE);
        expect(result).toBe(true); // 100 is > 20% of 80
    });

    it('should return false if timestamp is invalid', async () => {
        const vitals: PatientVitals = {
            id: 'a',
            patientId: '123',
            timestamp: 'invalid-date',
            heartRate: 80,
            spO2: 97,
            respiratoryRate: 97.5,
            bodyTemperature: 36.5
        };

        const result = await service.isVitalOutOfAverage(vitals, VitalField.HEART_RATE);
        expect(result).toBe(false);
    });
});
