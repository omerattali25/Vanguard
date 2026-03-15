import type { Machine } from "@/types/machine";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import { ChangePatientPopover } from "./change-patient-popover.tsx";
import { MachineStatusBadge } from "./machine-status-badge.tsx";
import { AddMachineForm } from "../add-machine-form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

interface MachinesTableProps {
  machines: Machine[];
}
export const MachinesTable: React.FC<MachinesTableProps> = (props) => {
  const [updatedName,setUpdatedName]=useState("")
  const [updated,setUpdatedLocatin]=useState("")
  return (
    <>
      <Table  className="w-full md:w-1/2 mt-10 border mx-auto">
        <TableCaption>מכונות</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">מכונה </TableHead>
            <TableHead className="w-[100px] text-center">שם</TableHead>
            <TableHead className="w-[100px] text-center ">מטופל</TableHead>
            <TableHead className="w-[100px] text-center ">מיקום</TableHead>
            <TableHead className="w-[100px] text-center ">סטטוס</TableHead>
             <TableHead className="w-[100px] text-center"></TableHead>
              <TableHead className="w-[100px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.machines.map((machine) => {
            return (
              <TableRow>
                <TableCell className="text-center">{machine.id}</TableCell>
                <TableCell className="text-center"><Input value={machine.name} onChange={(e)=>{setUpdatedName(e.currentTarget.value)}}></Input></TableCell>
                <TableCell className="text-center" >{machine.assinged}</TableCell>
                <TableCell className="text-center" ><Input value={machine.location } onChange={(e)=>{setUpdatedName(e.currentTarget.value)}}></Input></TableCell>
                <TableCell className="text-center" ><MachineStatusBadge status={machine.status}/></TableCell>
                <TableCell className="text-center" ><ChangePatientPopover machine={machine} patients={[]}/></TableCell>
                <TableCell className="text-center" ><Button onClick={()=>{
                  
                }}> עדכן</Button></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter><AddMachineForm/></TableFooter>
      </Table>
    </>
  );
};
