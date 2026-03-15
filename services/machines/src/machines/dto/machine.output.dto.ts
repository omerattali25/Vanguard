import { MachineStatus } from '@vanguard/types';

export interface MachineOutputDto {
  name: string;
  id: string;
  location: string;
  status: MachineStatus;
  assigned: string;
}
