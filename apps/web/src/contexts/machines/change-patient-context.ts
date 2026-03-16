import { createContext } from "react";

export const ChangePatientContext=createContext({
    lockId:'',
    machineId:'',
    changeLockId:(param:string)=>{},
    changeMachineId:(param:string)=>{}
});