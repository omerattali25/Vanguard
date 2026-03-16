import React, { useContext, useState } from "react";
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
import { AddMachineForm } from "./add-machine-form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverTrigger } from "@/components/ui/popover.tsx";
import { useMachines, useStartChangePatient, useUpdateMachineMutate } from "api/machines/machines.query.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ChangePatientContext } from "@/contexts/machines/change-patient-context.ts";

export const MachinesTable: React.FC =() => {
  const [updatedName, setUpdatedName] = useState("");
  const [updatedLocation, setUpdatedLocatin] = useState("");
  const {data,isPending,error}=useMachines();
  const {mutate:updateMachine}=useUpdateMachineMutate();
  const {mutateAsync:startChangePatient}=useStartChangePatient();
  const {changeLockId,changeMachineId}=useContext(ChangePatientContext)
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
        <ChangePatientPopover />
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
                        onClick={async() => {
                         changeMachineId(machine.id)
                          try{
                          const res=await startChangePatient(machine.id)
                          alert(res)
                          changeLockId(res)
                          }
                          catch(err){
                            alert(err)
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
            <TableRow>
              <TableCell>    <AddMachineForm /></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Popover>
    </>
  );
  }
};
