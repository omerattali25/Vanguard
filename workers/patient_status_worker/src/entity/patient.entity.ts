import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export enum PatientStatus {
  Stable = 'stable',
  Unstable = 'unstable',
  Critical = 'critical',
}

@Entity()
export class Patient {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ type: 'enum', enum: PatientStatus })
  status: string;

  @CreateDateColumn()
  registered_at: string;
}
