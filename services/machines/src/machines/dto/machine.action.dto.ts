import { IsString } from 'class-validator';
import { MachineActionType } from '@vanguard/types';

export class MachineActionDto {
  @IsString()
  machine_id: string;
  @IsString()
  patient_id: string;
  @IsString()
  description: string;
  type: MachineActionType;

  constructor(
    machine_id: string,
    patient_id: string,
    description: string,
    type: MachineActionType,
  ) {
    this.machine_id = machine_id;
    this.patient_id = patient_id;
    this.description = description;
    this.type = type;
  }
}
