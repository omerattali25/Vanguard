import LineGraph from '@/components/atoms/graphs/line-graph';
import { Vital } from '../../types/vitals';
import { useParams } from 'react-router-dom';
import { Patient } from 'types/patient';
import { PatientStatus } from '../../types/patinet_status';
import PatientCard from '@/components/atoms/patients/patient-card';

const PatientVitals = () => {
    const { id } = useParams();
    //TODO: fetch patient vitals using id
    //const patient : Patient = getPatientById(id ?? "");
    const patient: Patient = {
        id: "1",
        name: "פלוני אלמוני",
        city: "תל אביב",
        status: PatientStatus.Stable,
        registred_at: new Date("2025-01-10"),
    };
    //const patientsVitals = getPatientVitals(id ?? "");
    const patientsVitals: Vital[] = [
        { "id": "1", "patient_id": id ?? "", "heart_rate": 82, "respiratory_rate": 16, "body_temperature": 36.7, "spO2": 98, "timestamp": "2026-03-09T12:00:00Z" },
        { "id": "2", "patient_id": id ?? "", "heart_rate": 84, "respiratory_rate": 17, "body_temperature": 36.7, "spO2": 98, "timestamp": "2026-03-09T12:00:10Z" },
        { "id": "3", "patient_id": id ?? "", "heart_rate": 83, "respiratory_rate": 16, "body_temperature": 36.8, "spO2": 97, "timestamp": "2026-03-09T12:00:20Z" },
        { "id": "4", "patient_id": id ?? "", "heart_rate": 86, "respiratory_rate": 17, "body_temperature": 36.8, "spO2": 97, "timestamp": "2026-03-09T12:00:30Z" },
        { "id": "5", "patient_id": id ?? "", "heart_rate": 88, "respiratory_rate": 18, "body_temperature": 36.9, "spO2": 97, "timestamp": "2026-03-09T12:00:40Z" },
        { "id": "6", "patient_id": id ?? "", "heart_rate": 89, "respiratory_rate": 18, "body_temperature": 36.9, "spO2": 96, "timestamp": "2026-03-09T12:00:50Z" },
        { "id": "7", "patient_id": id ?? "", "heart_rate": 85, "respiratory_rate": 17, "body_temperature": 36.8, "spO2": 98, "timestamp": "2026-03-09T12:01:00Z" },
        { "id": "8", "patient_id": id ?? "", "heart_rate": 84, "respiratory_rate": 16, "body_temperature": 36.7, "spO2": 99, "timestamp": "2026-03-09T12:01:10Z" },
        { "id": "9", "patient_id": id ?? "", "heart_rate": 83, "respiratory_rate": 16, "body_temperature": 36.7, "spO2": 99, "timestamp": "2026-03-09T12:01:20Z" },
        { "id": "10", "patient_id": id ?? "", "heart_rate": 82, "respiratory_rate": 15, "body_temperature": 36.6, "spO2": 99, "timestamp": "2026-03-09T12:01:30Z" },
        { "id": "11", "patient_id": id ?? "", "heart_rate": 81, "respiratory_rate": 15, "body_temperature": 36.6, "spO2": 98, "timestamp": "2026-03-09T12:01:40Z" },
        { "id": "12", "patient_id": id ?? "", "heart_rate": 80, "respiratory_rate": 15, "body_temperature": 36.6, "spO2": 98, "timestamp": "2026-03-09T12:01:50Z" },
        { "id": "13", "patient_id": id ?? "", "heart_rate": 79, "respiratory_rate": 15, "body_temperature": 36.5, "spO2": 98, "timestamp": "2026-03-09T12:02:00Z" },
        { "id": "14", "patient_id": id ?? "", "heart_rate": 81, "respiratory_rate": 16, "body_temperature": 36.6, "spO2": 97, "timestamp": "2026-03-09T12:02:10Z" },

    ];
    let heart_rate_data: { time: string; vitalSign: number }[] = [];
    let spO2_data: { time: string; vitalSign: number }[] = [];
    let respiratory_rate_data: { time: string; vitalSign: number }[] = [];
    let body_temperature_data: { time: string; vitalSign: number }[] = [];
    patientsVitals.forEach((vital) => {
        heart_rate_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.heart_rate });
        spO2_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.spO2 });
        respiratory_rate_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.respiratory_rate });
        body_temperature_data.push({ time: new Date(vital.timestamp).toLocaleTimeString(), vitalSign: vital.body_temperature });
    });

    return (
        <>
            <PatientCard patient={patient} lastPatientVitals={patientsVitals[patientsVitals.length - 1]} />
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