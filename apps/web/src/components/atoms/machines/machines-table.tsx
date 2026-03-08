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
} from "../../ui/table";
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
             <TableHead className="w-[100px] "></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.machines.map((machine) => {
            return (
              <TableRow>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.assinged}</TableCell>
                <TableCell><ChangePatientPopover patients={["123456677"]} machine={machine}/></TableCell>
              </TableRow>
            );
          })}
           <TableRow>
                <TableCell>dfsdfsdf</TableCell>
                <TableCell>dfdsfsdfd</TableCell>
              </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
