import { IsOptional, IsString, IsUUID } from 'class-validator';

export class Machine {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  assigned: string | null;
}
