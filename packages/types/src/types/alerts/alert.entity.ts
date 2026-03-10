import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { PatientVitalField } from "../vitals/input/patient-vitals.input";

@Entity()
@Index(["patient_id", "vital_field", "started_at"])
export class Alert {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    patient_id: string;

    @Column({ type: 'enum', enum: PatientVitalField })
    vital_field: PatientVitalField;

    @Column()
    description: string;

    @Column({ type: 'timestamptz' })
    started_at: string;

    @Column({ type: 'timestamptz', nullable: true })
    ended_at?: string | null;
}