import { IsString, IsNotEmpty } from "class-validator";

export class MachineInputDto {
    @IsString()
    @IsNotEmpty()
    name: string
}