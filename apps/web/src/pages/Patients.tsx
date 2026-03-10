import { PatientStatusBadge } from '@/components/atoms/patients/patient-status-badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Patient } from "types/patient"
interface PatientsTableProps {
  patients: Patient[];
}

export const Patients: React.FC<PatientsTableProps> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Table  className="w-full md:w-1/2 mt-10 border mx-auto">
        <TableCaption>מטופלים</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead  className="text-center">מצב מטופל </TableHead>
            <TableHead  className="text-center">שם המטופל</TableHead>
            <TableHead  className="text-center">כתובת מגורים</TableHead>
             <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.patients.map((patient) => {
            return (
              
              <TableRow onClick={() => {navigate(`/patients/${patient.id}`)} } className="cursor-pointer hover:bg-muted">
                <TableCell className="text-center"><PatientStatusBadge status={patient.status}/></TableCell>
                <TableCell className="text-center">{patient.name}</TableCell>
                <TableCell className="text-center">{patient.city}</TableCell>
               </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default Patients


