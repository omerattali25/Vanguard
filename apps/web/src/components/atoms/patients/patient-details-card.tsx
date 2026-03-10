import React from 'react'
import { Patient } from 'types/patient';
import PatientDetailCard from './patient-detail-card';

interface PatientDetailsCardProps {
    patient: Patient;
}

const PatientDetailsCard = ({ patient }: PatientDetailsCardProps) => {
    return (
        <div className="space-y-2 border-b pb-4">
            <p className="text-center font-semibold text-sm text-muted-foreground">
                פרטי המטופל
            </p>

            <PatientDetailCard label="עיר" value={patient.city} />
            <PatientDetailCard label="סטטוס" value={patient.status} />
        </div>

    )
}

export default PatientDetailsCard