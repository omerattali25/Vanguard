import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity()
@Index(["patient_id", "created_at"])
export class VitalEntity {
  @PrimaryColumn()  
  id: string;

  @Column()
  patient_id: string;

  @Column('decimal')
  heart_rate: number;

  @Column('decimal')
  respiratory_rate: number;

  @Column('decimal')
  body_temperature: number;

  @Column('decimal')
  spO2: number;

  @Column({ type: 'timestamptz' })
  created_at: string;
}