import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class MachineChangePatientDto {
  @IsString()
  @IsNotEmpty()
  patient: string;
  @IsString()
  @IsNotEmpty()
  lockID: string;
}
