import { MachinesTable } from "@/components/atoms/machines/machines-table";
import { Machine } from "@/types/machine";
import React from "react";

interface MachinesPageProps{
    machines:Machine[]
}

export const MachinesPage:React.FC<MachinesPageProps>=(props)=>{
    return(
        <>
        <MachinesTable machines={props.machines}/>
        </>
    )
}