import React from 'react'
import { Vital } from 'types/vitals'
import PatientVitalCard from './patient-vital-card';

interface PatientVitalsCardProps {
    patientVitals: Vital;
}

const PatientVitalsCard = ({ patientVitals }: PatientVitalsCardProps) => {
    return (
        <div className="space-y-3 ">
            <p className="text-center font-semibold text-sm text-muted-foreground">
                נתונים אחרונים
            </p>

            <p className="text-xs text-center text-muted-foreground">
                {new Date(patientVitals.timestamp).toDateString()}{" "}
                {new Date(patientVitals.timestamp).toLocaleTimeString()}
            </p>

            <div className="grid grid-cols-2 gap-2 text-center">
                <PatientVitalCard label="SpO₂" value={patientVitals.spO2} />
                <PatientVitalCard label="דופק" value={patientVitals.heart_rate} />
                <PatientVitalCard label="קצב נשימה" value={patientVitals.respiratory_rate} />
                <PatientVitalCard label="טמפרטורה" value={patientVitals.body_temperature} />
            </div>

        </div>
    )
}

export default PatientVitalsCard