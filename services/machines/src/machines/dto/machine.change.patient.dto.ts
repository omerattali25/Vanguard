import Redlock from "redlock";

export class MachineChangePatientDto {
  patient: string;
  lockID: string;
}
