
interface PatientVitalsCardProps {
    label: string;
    value: number;
}

const PatientVitalCard = ({ label, value }: PatientVitalsCardProps) => {
    return (
        <div className="rounded-lg bg-muted p-2">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">
                {value}
            </p>
        </div>
    )
}

export default PatientVitalCard