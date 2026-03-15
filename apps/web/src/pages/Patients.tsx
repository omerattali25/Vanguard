import { PatientStatusBadge } from "@/components/atoms/patients/patient-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePatients } from "../../api/patients/patient.query";
import { useNavigate } from "react-router-dom";


export const Patients = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = usePatients();

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
          {data?.map((patient) => {
            return (
              <TableRow
                onClick={() => {
                  navigate(`/patients/${patient.id}`);
                }}
                className="cursor-pointer hover:bg-muted"
              >
                <TableCell className="text-center">
                  <PatientStatusBadge status={patient.status} />
                </TableCell>
                <TableCell className="text-center">{patient.name}</TableCell>
                <TableCell className="text-center">{patient.city}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default Patients;
