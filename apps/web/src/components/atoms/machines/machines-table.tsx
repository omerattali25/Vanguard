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
            <TableHead className="w-[100px]">מכונה </TableHead>
            <TableHead className="w-[100px] ">מטופל</TableHead>
            <TableHead className="w-[100px] ">מיקום</TableHead>
            <TableHead className="w-[100px] ">סטטוס</TableHead>
             <TableHead className="w-[100px] "></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.machines.map((machine) => {
            return (
              <TableRow>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.assinged}</TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{machine.status}</TableCell>
                <TableCell><ChangePatientPopover machine={machine} patients={[]}/></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
