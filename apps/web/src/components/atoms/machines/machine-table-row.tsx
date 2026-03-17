import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { MachineStatusBadge } from "./machine-status-badge";
import { PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Machine } from "@vanguard/types";
import { useContext, useState } from "react";
import {
  useStartChangePatient,
  useUpdateMachineMutate,
} from "api/machines/machines.query";
import { ChangePatientContext } from "@/contexts/machines/change-patient-context";
import axios from "axios";
import { ErrorResponse } from "react-router-dom";

interface IMachineRowProps {
  machine: Machine;
}
export const MachineTableRow: React.FC<IMachineRowProps> = (props) => {
  const [updatedName, setUpdatedName] = useState(props.machine.name);
  const [updatedLocation, setUpdatedLocatin] = useState(props.machine.location);
  const { mutate: updateMachine } = useUpdateMachineMutate();
  const { mutateAsync } = useStartChangePatient();
  const { changeLockId, changeMachineId } = useContext(ChangePatientContext);
  return (
    <TableRow>
      <TableCell className="text-center w-[150px]">
        {props.machine.id}
      </TableCell>
      <TableCell className="text-center w-[150px]">
        <Input
          className="text-center w-[150px]"
          defaultValue={props.machine.name}
          onChange={(e) => {
            setUpdatedName(e.currentTarget.value);
          }}
        ></Input>
      </TableCell>
      <TableCell className="text-center w-[150px]">
        {props.machine.assigned}
      </TableCell>
      <TableCell className="text-center w-[150px]">
        <Input
          className="text-center w-[150px]"
          defaultValue={props.machine.location}
          onChange={(e) => {
            setUpdatedLocatin(e.currentTarget.value);
          }}
        ></Input>
      </TableCell>
      <TableCell className="text-center w-[150px]">
        <MachineStatusBadge status={props.machine.status} />
      </TableCell>
      <TableCell className="text-center w-[150px]">
        {" "}
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            onClick={async () => {
              changeMachineId(props.machine.id);
              try {
                const res = await mutateAsync(props.machine.id);
                changeLockId(res);
              } catch (err) {
                if (axios.isAxiosError(err)) {
                  if (err.response?.status == 500) {
                    alert("המכונה תפוסה");
                  }
                } else {
                  alert(err);
                }
              }
            }}
          >
            החלף מטופל
          </Button>
        </PopoverTrigger>
      </TableCell>
      <TableCell className="text-center w-[150px]">
        <Button
          onClick={() => {
            const machineId = props.machine.id;
            const nameChanged = updatedName !== props.machine.name;
            const locationChanged = updatedLocation !== props.machine.location;

            if (
              updatedName !== props.machine.name ||
              updatedLocation !== props.machine.location
            ) {
              updateMachine({
                machineId: machineId,
                updatedName: nameChanged ? updatedName : "",
                updatedLocation: locationChanged ? updatedLocation : "",
              });
            }
          }}
        >
          {" "}
          עדכן
        </Button>
      </TableCell>
    </TableRow>
  );
};
