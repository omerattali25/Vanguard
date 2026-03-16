import { IsString } from 'class-validator';
export class MachineUpdateDto {
  @IsString()
  name?: string;
  @IsString()
  location?: string;
}
