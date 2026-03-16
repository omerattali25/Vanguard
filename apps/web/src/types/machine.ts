import type { MachineStatus } from "./machine-status"

export interface Machine{
    id:string 
    name:string  
    assigned:string 
    location:string
    status:MachineStatus
}