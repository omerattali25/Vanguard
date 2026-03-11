  import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
  @Entity()
  export class MachineAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ default: '' })
    machine_id: string;
    @Column({ default: '' })
    patient_id: string;
    @Column({ default: '' })
    description: string
    @CreateDateColumn()
    trigerd_at: Date;
  }
