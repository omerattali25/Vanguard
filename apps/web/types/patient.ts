import {PatientStatus} from "types/patinet_status"
export interface Patient{
    id:string 
    name:string 
    city:string
    status:PatientStatus 
    registred_at:Date  
}

