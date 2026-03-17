import {
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangePatientContext } from "@/contexts/machines/change-patient-context";
import { useChangePatient } from "api/machines/machines.query";
import { usePatients } from "api/patients/patient.query";
import { useContext, useState } from "react";


export const ChangePatientPopover: React.FC = (
) => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const { data, isPending, error } = usePatients();
  const {mutate:changePatient}=useChangePatient()
  const {machineId,lockId}=useContext(ChangePatientContext)
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
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>החלף מטופל </PopoverTitle>
          <PopoverDescription>
            בחר מטופל אחר כדי להעביר את מכונת ההנשמה
          </PopoverDescription>
        </PopoverHeader>
        <Select onValueChange={(value) => setSelectedPatient(value)}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="בחר מטופל" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>מטופלים</SelectLabel>
              {data.map((patient) => {
                return <SelectItem value={patient.id}>{patient.name}</SelectItem>;
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <button
          className="mt-4"
          onClick={() => {
            if (selectedPatient) {
                changePatient({machineId:machineId, patient:selectedPatient, lockId:lockId})
            } 
            else {
              alert("אנא בחר מטופל");
            }
          }}
        >
          אשר החלפה
        </button>
      </PopoverContent>
    );
  }
};
