import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { usePatientAnalytics } from 'api/analytics/patients-analytics/patients-analitycs.query';
import { Table } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PatientAnalytics = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isPending, error } = usePatientAnalytics(id ?? '');
    if (isPending) {
        return <div>...טוען את כל הנתונים</div>
    }
    if (error) {
        return <div>שגיאה: {error.message}</div>
    }
    return (
        <>
            <Table className="w-full md:w-1/2 mt-10 border mx-auto">
                <TableCaption>אירועי מטופל</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">שם מטופל</TableHead>
                        <TableHead className="text-center">תיאור הפעולה</TableHead>
                        <TableHead className="text-center">זמן הפעולה</TableHead>
                        <TableHead className="text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((patient) => {
                        return (
                            <TableRow
                                onClick={() => {
                                    navigate(`/patients/${id}`);
                                }}
                                className="cursor-pointer hover:bg-muted"
                            >
                                <TableCell className="text-center">{patient.patient_name}</TableCell>
                                <TableCell className="text-center">{patient.description}</TableCell>
                                <TableCell className="text-center">{patient.trigerd_at.toLocaleDateString()}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    )
}

export default PatientAnalytics
