
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Vital {
  @PrimaryGeneratedColumn('uuid')
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