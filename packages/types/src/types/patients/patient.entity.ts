import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum PatientStatus {
    Stable = "stable",
    Unstable = "unstable",
    Critical = "critical",
}

@Entity()
export class Patient {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ type: 'enum', enum: PatientStatus, default: PatientStatus.Stable })
  status: PatientStatus;

  @CreateDateColumn()
  registered_at: string;

  @UpdateDateColumn()
  updated_at: string;
}