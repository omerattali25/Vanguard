import LineGraph from "@/components/atoms/graphs/line-graph";
import { useParams } from "react-router-dom";
import PatientCard from "@/components/atoms/patients/patient-card";
import { usePatient } from "api/patients/patient.query";
import { usePatientVitals } from "api/vitals/vitals.query";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Vital } from "types/vitals";

const socket = io('http://localhost:3001');

const PatientVitals = () => {
  const { id } = useParams();
  const [patientsVitals, setPatientsVitals] = useState<Vital[]>([]);
  const { data: patient, isPending, error } = usePatient(id ?? "");
  const {
    data,
    isPending: isVitalsPending,
    error: vitalsError,
  } = usePatientVitals(id ?? "");

  setPatientsVitals(data ?? []);

  useEffect(() => {
    setPatientsVitals(data ?? []);
  }, [data]);

  useEffect(() => {
    if (!id) return;

    socket.emit("join", `vitals:${id}`);

    const newVitalHandler = (newVital: Vital) => {
      setPatientsVitals((prev) => [...prev, newVital]);
    };

    socket.on("vitals", newVitalHandler);
    
    return () => {
      socket.off("vitals", newVitalHandler);
      socket.emit("leave", `vitals:${id}`);
    };
  }, [id]);

  if (!id) {
    return <div>Patient not found</div>;
  }

  if (isPending || isVitalsPending) {
    return <div>Loading...</div>;
  }

  if (error || vitalsError) {
    return <div>Error: {(error ?? vitalsError)?.message}</div>;
  }

  const heart_rate_data =
    patientsVitals?.map((v) => ({
      time: new Date(v.created_at).toLocaleTimeString(),
      vitalSign: v.heart_rate,
    })) ?? [];
  const spO2_data =
    patientsVitals?.map((v) => ({
      time: new Date(v.created_at).toLocaleTimeString(),
      vitalSign: v.spO2,
    })) ?? [];
  const respiratory_rate_data =
    patientsVitals?.map((v) => ({
      time: new Date(v.created_at).toLocaleTimeString(),
      vitalSign: v.respiratory_rate,
    })) ?? [];
  const body_temperature_data =
    patientsVitals?.map((v) => ({
      time: new Date(v.created_at).toLocaleTimeString(),
      vitalSign: v.body_temperature,
    })) ?? [];
 
  return (
    <>
      <PatientCard
        patient={patient}
        lastPatientVitals={patientsVitals?.[patientsVitals.length - 1]}
      />
      <div className="w-full h-full">
        <div className="w-full h-full grid grid-cols-2 gap-4">
          <LineGraph
            data={heart_rate_data.reverse()}
            datakey="דופק"
            y_domain={30}
            medical_units="bpm"
            stroke="#a92e2e"
          />
          <LineGraph
            data={spO2_data.reverse()}
            datakey="SpO₂"
            y_domain={90}
            medical_units="%"
            stroke="#2e7aa9"
          />
          <LineGraph
            data={respiratory_rate_data.reverse()}
            datakey="קצב נשימה"
            y_domain={10}
            medical_units="breaths/min"
            stroke="#552ea9"
          />
          <LineGraph
            data={body_temperature_data.reverse()}
            datakey="טמפ' גוף"
            y_domain={35}
            medical_units="°C"
            stroke="#2ea955"
          />
        </div>
      </div>
    </>
  );
};

export default PatientVitals;
