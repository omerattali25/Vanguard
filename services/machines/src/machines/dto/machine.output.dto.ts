import { MachineStatus } from "../entity/machine.entity";

export class MachineOutputDto{
        name: string;
        id: string;
        location: string;
        status: MachineStatus;
        assigned: string;

        constructor(name:string,id:string,location:string,status:MachineStatus,assigned:string){
            this.name=name
            this.location=location
            this.id=id
            this.status=status
            this.assigned=assigned
        }

}