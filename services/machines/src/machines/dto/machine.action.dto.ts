export class MachineActionDto {
  machine_id: string;
  patient_id: string;
  description: string;

  constructor(machine_id: string, patient_id: string, description: string) {
    this.machine_id = machine_id;
    this.patient_id = patient_id;
    this.description = description;
  }
}