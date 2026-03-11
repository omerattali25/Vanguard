import { IsString } from "class-validator";

export class MachineActionDto {
  @IsString()
  machine_id: string;
  @IsString()
  patient_id: string;
  @IsString()
  description: string;

  constructor(machine_id: string, patient_id: string, description: string) {
    this.machine_id = machine_id;
    this.patient_id = patient_id;
    this.description = description;
  }
}