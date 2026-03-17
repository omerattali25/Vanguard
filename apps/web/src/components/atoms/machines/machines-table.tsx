import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { ChangePatientPopover } from "./change-patient-popover.tsx";
import { AddMachineForm } from "./add-machine-form.tsx";
import { Popover } from "@/components/ui/popover.tsx";
import {
  useExitChangePatient,
  useMachines,
} from "api/machines/machines.query.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ChangePatientContext } from "@/contexts/machines/change-patient-context.ts";
import { Machine } from "../../../types/machine.ts";
import { io } from "socket.io-client";
import { MachineTableRow } from "./machine-table-row.tsx";

const socket = io("http://localhost:3001");
export const MachinesTable: React.FC = () => {
  const { data, isPending, error } = useMachines();
  const { lockId, machineId } = useContext(ChangePatientContext);
  const [machines, setMachines] = useState<Machine[]>([]);
  const { mutate: exitChangePatient } = useExitChangePatient();
  const [open, setOpen] = useState(false);
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      console.log("dbfgvdf");
      exitChangePatient({ machineId: machineId, lockId: lockId });
    }
  };

  useEffect(() => {
    setMachines(data ?? []);
  }, [data]);

  useEffect(() => {
    socket.emit("join", `machines`);

    const newMachineHandler = (newMachine: Machine) => {
      setMachines((prev) => {
        const removedOriginal = prev.filter(
          (machine) => machine.id !== newMachine.id,
        );
        const newMachines = [...removedOriginal, newMachine];
        return newMachines;
      });
    };

    socket.on("machines", newMachineHandler);

    return () => {
      socket.off("machines", newMachineHandler);
      socket.emit("leave", `machines`);
    };
  }, []);

  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-full md:w-1/2 space-y-4">
          <Skeleton className="h-8 w-40 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (data) {
    return (
      <>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <ChangePatientPopover />
          <Table className="w-full md:w-1/2 mt-10 border mx-auto">
            <TableCaption>מכונות</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] text-center">מכונה </TableHead>
                <TableHead className="w-[150px] text-center">שם</TableHead>
                <TableHead className="w-[150px] text-center ">מטופל</TableHead>
                <TableHead className="w-[150px] text-center ">מיקום</TableHead>
                <TableHead className="w-[150px] text-center ">סטטוס</TableHead>
                <TableHead className="w-[150px] text-center"></TableHead>
                <TableHead className="w-[150px] text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => {
                return <MachineTableRow key={machine.id} machine={machine} />;
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>
                  {" "}
                  <AddMachineForm />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Popover>
      </>
    );
  }
};
