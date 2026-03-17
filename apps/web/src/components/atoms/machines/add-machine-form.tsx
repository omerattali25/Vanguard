import { Field,FieldGroup } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePostMachineMutate } from "api/machines/machines.query";

export const AddMachineForm: React.FC = () => {
  const [machineName, setMachineName] = useState("");
    const {mutate:addMachine}=usePostMachineMutate()
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">+</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <PopoverHeader>
            <PopoverTitle className="mb-5">הוסף מכונה</PopoverTitle>
          </PopoverHeader>
          <FieldGroup>
            <Field orientation="horizontal">
              <Input id="name" placeholder="שם"  onChange={(e) => setMachineName(e.target.value)} />
            </Field>
          </FieldGroup>
          <Button variant="outline" className="mt-5" onClick={()=>{
            if(machineName){
              addMachine(machineName)
            }
            else{
              alert("אנא הזן שם מכונה")
            }
          }}>
            הוסף
          </Button >
        </PopoverContent>
      </Popover>
    </>
  );
};