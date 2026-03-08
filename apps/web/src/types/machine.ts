import type { MachineStatus } from "./machine-status"

export interface Machine{
    id:string 
    assinged:string 
    location:string
    status:MachineStatus
}