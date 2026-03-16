import { useEffect, useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { PatientStatusBadge } from "@/components/atoms/patients/patient-status-badge";
import { Patient } from "types/patient";
import { PatientStatus } from "types/patinet_status";
import { socket } from "@/pages/Patients";


export const PatientRow = ({ patient, onClick }: { patient: Patient, onClick: () => void }) => {
    const [status, setStatus] = useState<PatientStatus>(patient.status);

    useEffect(() => {
        const handleStatusUpdate = (updated: { patient_id: string; status: PatientStatus }) => {
            if (updated.patient_id === patient.id) {
                if(updated.status !== status) {
                    setStatus(updated.status);
                }
            }
        };

        socket.on("patient-status", handleStatusUpdate);

        return () => {
            socket.off("patient-status", handleStatusUpdate);
        };
    }, [patient.id]);

    return (
        <TableRow onClick={onClick} className="cursor-pointer hover:bg-muted">
            <TableCell className="text-center">
                {/* Only this badge re-renders when status changes! */}
                <PatientStatusBadge status={status} />
            </TableCell>
            <TableCell className="text-center">{patient.name}</TableCell>
            <TableCell className="text-center">{patient.city}</TableCell>
        </TableRow>
    );
};