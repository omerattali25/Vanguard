import { Vital } from 'types/vitals'
import PatientVitalCard from './patient-vital-card';

interface PatientVitalsCardProps {
    patientVitals: Vital | undefined;
}

const PatientVitalsCard = ({ patientVitals }: PatientVitalsCardProps) => {
    return (
        <div className="space-y-3 ">
            <p className="text-center font-semibold text-sm text-muted-foreground">
                נתונים אחרונים
            </p>

            <p className="text-xs text-center text-muted-foreground">
                {patientVitals ? new Date(patientVitals.timestamp).toDateString() : ""}{" "}
                {patientVitals ? new Date(patientVitals.timestamp).toLocaleTimeString() : ""}
            </p>

            <div className="grid grid-cols-2 gap-2 text-center">
                <PatientVitalCard label="SpO₂" value={patientVitals?.spO2 ?? 0} />
                <PatientVitalCard label="דופק" value={patientVitals?.heart_rate ?? 0} />
                <PatientVitalCard label="קצב נשימה" value={patientVitals?.respiratory_rate ?? 0} />
                <PatientVitalCard label="טמפרטורה" value={patientVitals?.body_temperature ?? 0} />
            </div>

        </div>
    )
}

export default PatientVitalsCard