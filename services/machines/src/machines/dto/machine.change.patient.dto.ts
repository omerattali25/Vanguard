import { IsString } from "class-validator";

export class MachineChangePatientDto {
  @IsString()
  patient: string;

  @IsString()
  lockID: string;
}
