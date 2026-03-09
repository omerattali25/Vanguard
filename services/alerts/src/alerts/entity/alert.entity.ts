import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export enum VitalField {
    HEART_RATE = 'heartRate',
    SP_O2 = 'spO2',
    RESPIRATORY_RATE = 'respiratoryRate',
    BODY_TEMPERATURE = 'bodyTemperature',
}

@Entity()
@Index(["patient_id", "vital_field", "started_at"])
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