import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useMachinesAnalytics } from "../../../api/analytics/machines-analytics/machines-analytics.query";
import { useNavigate } from "react-router-dom";
import { usePatients } from "api/patients/patient.query";

const MachinesAnalytics = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = useMachinesAnalytics();

  const { data: patients } = usePatients();

  if (isPending) {
    return <div>...טוען את כל הנתונים</div>;
  }

  if (error) {
    return <div>שגיאה: {error.message}</div>;
  }

  return (
    <>
      <Table className="w-full md:w-1/2 mt-10 border mx-auto">
        <TableCaption>אירועי מכונות</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center"> מכונה </TableHead>
            <TableHead className="text-center">תיאור הפעולה</TableHead>
            <TableHead className="text-center">זמן הפעולה</TableHead>
            <TableHead className="text-center">מטופל</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((machine) => {
            return (
              <TableRow
                onClick={() => {
                  navigate(`/patients/${machine.patient_id}`);
                }}
                className="cursor-pointer hover:bg-muted"
              >
                <TableCell className="text-center">
                  {machine.id.slice(0, 6)}
                </TableCell>
                <TableCell className="text-center">
                  {machine.description.toLowerCase()}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(machine.trigerd_at).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  {
                    patients?.find(
                      (patient) => patient.id === machine.patient_id,
                    )?.name
                  }
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default MachinesAnalytics;
