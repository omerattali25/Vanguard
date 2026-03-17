import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePatient,
  createMachine,
  exitChangePatient,
  getMachines,
  startChangePatient,
  updateMachine,
} from "./machines.api";
import { Machine } from "@/types/machine";

export function useMachines() {
  const { data, isPending, error } = useQuery({
    queryKey: ["machines"],
    queryFn: getMachines,
  });

  return { data, isPending, error };
}

export function usePostMachineMutate() {
  return useMutation({
    mutationFn: (name: string) => {
      return createMachine(name);
    },
  });
}
interface UpdateMachineInput {
  machineId: string;
  updatedName?: string;
  updatedLocation?: string;
}

export function useUpdateMachineMutate() {
  return useMutation({
    mutationFn: ({
      machineId,
      updatedName,
      updatedLocation,
    }: UpdateMachineInput) =>
      updateMachine(machineId, updatedName, updatedLocation),
  });
}

export const useStartChangePatient = () => {
  return useMutation<string, any, string>({
    mutationFn: (machineId: string) => startChangePatient(machineId),
  });
};

interface ChangePatientInput {
  machineId: string;
  patient: string;
  lockId: string;
}

export const useChangePatient = () => {
  return useMutation({
    mutationFn: ({ machineId, patient, lockId }: ChangePatientInput) =>
      changePatient(machineId, patient, lockId),
  });
};

interface ExistChangePatientInput {
  machineId: string;
  lockId: string;
}

export const useExitChangePatient = () => {
  return useMutation({
    mutationFn: ({ machineId, lockId }: ExistChangePatientInput) =>
      exitChangePatient(machineId, lockId),
  });
};
