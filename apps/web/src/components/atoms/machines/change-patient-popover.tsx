import { Button } from "@/components/ui/button";  
import {
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Popover,
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
import type { Machine } from "@/types/machine";
import { confirmChangePatient, startChangePatient } from "api/machines/machines.api";
import { useState } from "react";

interface ChangePatientPopoverProps {
  machine: Machine  
  patients: string[];
}
export const ChangePatientPopover: React.FC<ChangePatientPopoverProps> = (

  props,
) => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [changePatientToken, setChangePatientToken] = useState<string>("");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={async () => {
          const token = await startChangePatient(props.machine.id);
          setChangePatientToken(token);
        }}>
          החלף מטופל
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>החלף מטופל </PopoverTitle>
          <PopoverDescription>
            בחר מטופל אחר כדי להעביר את מכונת ההנשמה
          </PopoverDescription>
        </PopoverHeader>
        <Select onValueChange={(value)=>setSelectedPatient(value)}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="בחר מטופל"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>מטופלים</SelectLabel>
              {
                props.patients.map(patient=>{
                  return(
                    <SelectItem value={patient}>{patient}</SelectItem>
                  )
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <button className="mt-4" onClick={
          ()=>{
            if(selectedPatient){
              confirmChangePatient(props.machine.id, selectedPatient, changePatientToken);
            }
            else{ alert("אנא בחר מטופל")}
          }
        }>אשר החלפה</button>
      </PopoverContent>
    </Popover>
  );
};
