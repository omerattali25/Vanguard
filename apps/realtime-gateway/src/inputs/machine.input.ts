import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum MachineStatus {
  AVALIBLE = 'available',
  USED = 'used',
  IN_TRANSFER = 'in_transfer',
}

export class Machine {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(MachineStatus)
  status: MachineStatus;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  assigned: string | null;
}
