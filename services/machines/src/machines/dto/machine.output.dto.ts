import { MachineStatus } from "../entity/machine.entity";

export class MachineOutputDto{
        name: string;
        id: string;
        location: string;
        status: MachineStatus;
        assigned: string;

        constructor(name:string,id:string,location:string,status:MachineStatus,assigned:string){
            this.id=id
            this.name=name
            this.location=location
            this.status=status
            this.assigned=assigned
        }
}