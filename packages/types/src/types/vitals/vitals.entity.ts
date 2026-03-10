
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class VitalEntity {
  @Column()
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
  timestamp: string;
}