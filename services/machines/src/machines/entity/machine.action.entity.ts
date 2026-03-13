  import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
    export enum MachineActionType {
    CONNECTED = 'connected',
    DISSCONNECET = 'disconnected',
  }
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
    @Column({
      type: 'enum',
      enum: MachineActionType}
    )
    action_type:MachineActionType
    
  }
