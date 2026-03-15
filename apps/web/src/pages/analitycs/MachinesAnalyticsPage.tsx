import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useMachinesAnalytics } from 'api/analytics/machines-analytics/machines-analytics.query';
import { Table } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MachinesAnalyticsPage = () => {
    const navigate = useNavigate();
    const {data, isPending, error} = useMachinesAnalytics();
    if(isPending) {
        return <div>...טוען את כל הנתונים</div>
    }
    if(error) {
        return <div>שגיאה: {error.message}</div>
    }
    return (
        <>
            <Table className="w-full md:w-1/2 mt-10 border mx-auto">
                <TableCaption>אירועי מכונות</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">שם מכונה </TableHead>
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
                                    navigate(`/machines/${machine.id}`);
                                }}
                                className="cursor-pointer hover:bg-muted"
                            >
                                <TableCell className="text-center">{machine.machine_name}</TableCell>
                                <TableCell className="text-center">{machine.description}</TableCell>
                                <TableCell className="text-center">{machine.trigerd_at.toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">{machine.patient_name}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    )
}

export default MachinesAnalyticsPage