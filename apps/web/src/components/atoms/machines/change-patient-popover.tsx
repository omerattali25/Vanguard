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

interface ChangePatientPopoverProps {
  machine: Machine  
  patients: string[];
}
export const ChangePatientPopover: React.FC<ChangePatientPopoverProps> = (
  props,
) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={()=>{}}>
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
        <Select>
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
      </PopoverContent>
    </Popover>
  );
};
