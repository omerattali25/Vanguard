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
} from "@/components/ui/table.tsx";
import {
  ChangePatientPopover,
} from "./change-patient-popover.tsx";
import { MachineStatusBadge } from "./machine-status-badge.tsx";
import { AddMachineForm } from "../add-machine-form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverTrigger } from "@/components/ui/popover.tsx";
import { useMachines, useStartChangePatient, useUpdateMachineMutate } from "api/machines/machines.query.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export const MachinesTable: React.FC =() => {
  const [updatedName, setUpdatedName] = useState("");
  const [updatedLocation, setUpdatedLocatin] = useState("");
  const [changePatientMachineId, setChangePatientMachineId] = useState("");
  const {data,isPending,error}=useMachines();
  const {mutate:updateMachine}=useUpdateMachineMutate();
  const {mutate:startChangePatient,data:startChangeRes,error:startChangeErr}=useStartChangePatient();
  const [lockId,setLockId]=useState("")
  if(isPending){
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
  if(error){
      return <div>Error: {error.message}</div>;
  }
  if(data){
  return (
    <>
      <Popover>
        <ChangePatientPopover machineId={changePatientMachineId} lockId={lockId} />
        <Table className="w-full md:w-1/2 mt-10 border mx-auto">
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
            {data.map((machine) => {
              return (
                <TableRow>
                  <TableCell className="text-center">{machine.id}</TableCell>
                  <TableCell className="text-center">
                    <Input
                      value={machine.name}
                      onChange={(e) => {
                        setUpdatedName(e.currentTarget.value);
                      }}
                    ></Input>
                  </TableCell>
                  <TableCell className="text-center">
                    {machine.assinged}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      value={machine.location}
                      onChange={(e) => {
                        setUpdatedLocatin(e.currentTarget.value);
                      }}
                    ></Input>
                  </TableCell>
                  <TableCell className="text-center">
                    <MachineStatusBadge status={machine.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {" "}
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setChangePatientMachineId(machine.id)
                          startChangePatient(machine.id)
                          if(startChangeRes){
                          setLockId(startChangeRes)
                          }
                          if(startChangeErr){
                            alert(startChangeErr)
                          }
                        }}
                      >
                        החלף מטופל
                      </Button>
                    </PopoverTrigger>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button onClick={() => {
                        const machineId=machine.id
                        updateMachine({machineId,updatedName,updatedLocation})
                    }}> עדכן</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <AddMachineForm />
          </TableFooter>
        </Table>
      </Popover>
    </>
  );
  }
};
