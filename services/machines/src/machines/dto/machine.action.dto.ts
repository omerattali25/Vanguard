import { MachineActionType } from '@vanguard/types';

export interface MachineActionDto {
  machine_id: string;
  patient_id: string;
  description: string;
  type: MachineActionType;
}
