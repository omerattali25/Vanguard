import { MachinesTable } from "@/components/atoms/machines/machines-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMachines } from "api/machines/machines.query";
import { Machine } from "@/types/machine";
import React from "react";
import { MachineStatus } from "@/types/machine-status";
import { ChangePatientContextProvider } from "@/contexts/machines/change-patient-context-provider";

export const MachinesPage: React.FC = () => {
  const { data, isPending, error } = useMachines();
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
  return (
    <ChangePatientContextProvider>
      <MachinesTable />
    </ChangePatientContextProvider>
  );
};
