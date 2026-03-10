import React from 'react'

interface PatientDetailCardProps {
    label: string;
    value: string;
}
const PatientDetailCard = ({ label, value }: PatientDetailCardProps) => {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export default PatientDetailCard