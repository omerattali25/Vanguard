import { IsNotEmpty, IsString } from "class-validator";
export class MachineUpdateDto{
    @IsString()
    name?:string
    @IsString()
    @IsNotEmpty()
    id:string
    @IsString() 
    location?:string
}