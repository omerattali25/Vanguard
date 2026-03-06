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
} from "../ui/table";

interface MachinesTableProps {
  machines: Machine[];
}
export const MachinesTable: React.FC<MachinesTableProps> = (props) => {
  return (
    <>
      <Table>
        <TableCaption>מכונות</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">מכונה </TableHead>
            <TableHead>מטופל</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.machines.map((machine) => {
            return (
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.assinged}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
