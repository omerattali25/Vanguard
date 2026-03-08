import { Injectable } from '@nestjs/common';
import { KafkaConsumerService } from '../../kafka/kafka.consumer-service';
import {
  GetVitalsRequest,
  GetVitalsResponse,
  RecordVitalsRequest,
  RecordVitalsResponse,
} from '@vanguard/proto';

@Injectable()
export class IngestionService {
  constructor(private readonly kafkaConsumerService: KafkaConsumerService) {}

  getVitals(data: GetVitalsRequest): GetVitalsResponse {
    this.kafkaConsumerService.consume('vitals', (message) => {
      console.log(message);
    });

    // TODO: Replace with real data access logic
    return {
      patientId: data.patientId,
      heartRate: 72,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      temperature: 98.6,
      oxygenSaturation: 98,
      recordedAt: new Date().toISOString(),
    };
  }

  recordVitals(data: RecordVitalsRequest): RecordVitalsResponse {
    // TODO: Replace with real data persistence logic
    console.log('Recording vitals for patient:', data.patientId);
    return {
      success: true,
      message: `Vitals recorded for patient ${data.patientId}`,
      recordedAt: new Date().toISOString(),
    };
  }
}
