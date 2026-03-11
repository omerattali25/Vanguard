import { MachineStatus } from "../entity/machine.entity";

export class MachineUpdateDto{
    name?:string
    id:string
    location?:string
    status?:MachineStatus
}