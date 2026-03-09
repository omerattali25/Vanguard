import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
export enum MachineStatus {
  AVALIBLE = 'פנוי',
  USED = 'תפוס',
  IN_TRANSFER = 'בתנועה',
}
@Entity()
export class Machine{
  @Column()
  name: string;
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  location: string;
  @Column({ type: 'enum', enum: MachineStatus })
  status: MachineStatus;
  @Column({ nullable: true })
  assinged: string;
}