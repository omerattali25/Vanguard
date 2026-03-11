import LineGraph from '@/components/atoms/graphs/line-graph';
import { Vital } from '../../types/vitals';
import { useParams } from 'react-router-dom';
import { Patient } from 'types/patient';
import { PatientStatus } from '../../types/patinet_status';
import PatientCard from '@/components/atoms/patients/patient-card';
import { usePatient } from 'api/patients/patient.query';
import { usePatientVitals } from 'api/vitals/vitals.query';

const PatientVitals = () => {
    const { id } = useParams();
    //TODO: fetch patient vitals using id
    const { data: patient, isPending, error } = usePatient(id ?? "");
    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const { data: patientsVitals, isPending: isVitalsPending, error: vitalsError } = usePatientVitals(id ?? "");
    if (isVitalsPending) {
        return <div>Loading...</div>;
    }
    if (vitalsError) {
        return <div>Error: {vitalsError.message}</div>;
    }
        
    let heart_rate_data: { time: string; vitalSign: number }[] = [];
    let spO2_data: { time: string; vitalSign: number }[] = [];
    let respiratory_rate_data: { time: string; vitalSign: number }[] = [];
    let body_temperature_data: { time: string; vitalSign: number }[] = [];
    patientsVitals?.forEach((vital) => {
        heart_rate_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.heart_rate });
        spO2_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.spO2 });
        respiratory_rate_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.respiratory_rate });
        body_temperature_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.body_temperature });
    });

    return (
        <>
            <PatientCard patient={patient} lastPatientVitals={patientsVitals?.[patientsVitals.length - 1]} />
            <div className="w-full h-full">
                <div className="w-full h-full grid grid-cols-2 gap-4">
                    <LineGraph data={heart_rate_data} datakey="דופק" y_domain={30} medical_units="bpm" stroke="#a92e2e" />
                    <LineGraph data={spO2_data} datakey="SpO₂" y_domain={90} medical_units="%" stroke="#2e7aa9" />
                    <LineGraph data={respiratory_rate_data} datakey="קצב נשימה" y_domain={10} medical_units="breaths/min" stroke="#552ea9" />
                    <LineGraph data={body_temperature_data} datakey="טמפ' גוף" y_domain={35} medical_units="°C" stroke="#2ea955" />
                </div>
            </div>
        </>
    )
}

export default PatientVitals