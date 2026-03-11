  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
  export enum MachineStatus {
    AVALIBLE = 'available',
    USED = 'used',
    IN_TRANSFER = 'in_transfer',
  }
  @Entity()
  export class Machine {
    @Column()
    name: string;
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ default: 'storage' })
    location: string;
    @Column({
      type: 'enum',
      enum: MachineStatus,
      default: MachineStatus.AVALIBLE,
    })
    status: MachineStatus;
    @Column({ nullable: true, default: '' })
    assigned: string;
  }
