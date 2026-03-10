import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Patient } from 'types/patient'
import { Vital } from 'types/vitals';
import PatientDetailsCard from './patient-details-card';
import PatientVitalsCard from './patient-vitals-card';

interface PatientVitalsCardProps {
    patient: Patient;
    lastPatientVitals: Vital;
}

const PatientCard = ({ patient, lastPatientVitals }: PatientVitalsCardProps) => {
    return (
        <Card className="w-[360px] h-fit mt-10">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                    {patient.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 ">

                <PatientDetailsCard patient={patient} />
                <PatientVitalsCard patientVitals={lastPatientVitals} />

            </CardContent>
        </Card>
    )
}

export default PatientCard