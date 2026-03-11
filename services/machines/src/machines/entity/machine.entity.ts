  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
  export enum MachineStatus {
    AVALIBLE = 'פנוי',
    USED = 'תפוס',
    IN_TRANSFER = 'בתנועה',
  }
  @Entity()
  export class Machine {
    @Column()
    name: string;
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ default: 'חדר מכונות' })
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
