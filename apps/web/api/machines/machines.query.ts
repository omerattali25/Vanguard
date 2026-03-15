import { useMutation, useQuery } from "@tanstack/react-query";
import { changePatient, createMachine, getMachines, startChangePatient, updateMachine } from "./machines.api";
import { Machine } from "@/types/machine";

export function useMachines() {
    const { data, isPending, error } = useQuery({
        queryKey: ['machines'],
        queryFn: getMachines,
    });

    return { data, isPending, error };
}

export function usePostMachineMutate(){
    return useMutation(
        {
            mutationFn:(name:string)=>{return createMachine(name)}
        }
    )
}
interface UpdateMachineInput {
  machineId: string;
  updatedName?: string;
  updatedLocation?: string;
}

export function useUpdateMachineMutate() {
  return useMutation({
    mutationFn: ({ machineId, updatedName, updatedLocation }:UpdateMachineInput) =>
      updateMachine(machineId, updatedName,updatedLocation)
  });
}

export const useStartChangePatient = () => {
  return useMutation<string,Error,string>({
    mutationFn: (machineId: string) => startChangePatient(machineId)
  });
};

interface ChangePatientInput {
  machineId: string;
  patient: string;
  token: string;
}

export const useChangePatient = () => {
  return useMutation({
    mutationFn: ({ machineId, patient, token }: ChangePatientInput) =>
      changePatient(machineId, patient, token),
  });
};


