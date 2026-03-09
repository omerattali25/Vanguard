import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export enum VitalField {
    HeartRate = 'heartRate',
    SpO2 = 'spO2',
    RespiratoryRate = 'respiratoryRate',
    BodyTemperature = 'bodyTemperature',
}

@Entity()
@Index(["patient_id", "started_at"])
export class Alert {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    patient_id: string;

    @Column({ type: 'enum', enum: VitalField })
    vital_field: VitalField;

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    started_at: string;

    @Column({ type: 'timestamp', nullable: true })
    ended_at?: string | null;
}