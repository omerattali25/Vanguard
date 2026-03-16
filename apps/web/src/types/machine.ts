import type { MachineStatus } from "./machine-status"

export interface Machine{
    id:string 
    name:string
    assinged:string 
    location:string
    status:MachineStatus
}