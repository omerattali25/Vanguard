import type { Machine } from "@/types/machine";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import { ChangePatientPopover } from "./change-patient-popover.tsx";
import { MachineStatusBadge } from "./machine-status-badge.tsx";

interface MachinesTableProps {
  machines: Machine[];
}
export const MachinesTable: React.FC<MachinesTableProps> = (props) => {
  return (
    <>
      <Table  className="w-full md:w-1/2 mt-10 border mx-auto">
        <TableCaption>מכונות</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">מכונה </TableHead>
            <TableHead className="w-[100px] text-center ">מטופל</TableHead>
            <TableHead className="w-[100px] text-center ">מיקום</TableHead>
            <TableHead className="w-[100px] text-center ">סטטוס</TableHead>
             <TableHead className="w-[100px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.machines.map((machine) => {
            return (
              <TableRow>
                <TableCell className="text-center" >{machine.id}</TableCell>
                <TableCell className="text-center" >{machine.assinged}</TableCell>
                <TableCell className="text-center" >{machine.location}</TableCell>
                <TableCell className="text-center" ><MachineStatusBadge status={machine.status}/></TableCell>
                <TableCell className="text-center" ><ChangePatientPopover machine={machine} patients={[]}/></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
