import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../../ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const AddMachineForm: React.FC = () => {
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
              <Input id="id" placeholder="id" />
            </Field>
          </FieldGroup>
          <Button variant="outline" className="mt-5">
            הוסף
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
};
