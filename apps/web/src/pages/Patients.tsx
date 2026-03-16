import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePatients } from "../../api/patients/patient.query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Patient } from "types/patient";
import { io } from "socket.io-client";
import { PatientRow } from "@/components/atoms/patients/patient-row";

export const socket = io(import.meta.env.VITE_API_REALTIME_GATEWAY_URL);

export const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const { data, isPending, error } = usePatients();

  useEffect(() => {
    setPatients(data ?? []);
  }, [data]);

  useEffect(() => {

    socket.emit("join", `patients`);
    socket.emit("join", `patient-status`);

    const newPatientHandler = (newPatient: Patient) => {
      setPatients((prev) => [newPatient, ...prev]);
    };

    socket.on("patients", newPatientHandler);

    return () => {
      socket.off("patients", newPatientHandler);
      socket.emit("leave", `patients`);
      socket.emit("leave", `patient-status`);
    };
  });

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
    <>
      <Table className="w-full md:w-1/2 mt-10 border mx-auto">
        <TableCaption>מטופלים</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">מצב מטופל </TableHead>
            <TableHead className="text-center">שם המטופל</TableHead>
            <TableHead className="text-center">כתובת מגורים</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients?.map((patient) => {
            return (
              <PatientRow
                key={patient.id}
                patient={patient}
                onClick={() => navigate(`/patients/${patient.id}`)}
              />
          )})}
        </TableBody>
      </Table>
    </>
  );
};

export default Patients;
