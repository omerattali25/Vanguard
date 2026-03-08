import { PatientStatus } from "../../../types/patinet_status"

interface PatientStatusBadgeProps {
  status: PatientStatus
}

const patientStatusColors: Record<PatientStatus, string> = {
  [PatientStatus.Stable]: "#b2f2bb",
  [PatientStatus.Unstable]: "#ffec99",
  [PatientStatus.Critical]: "#fbb4b4",
}

const patientStatusLabel: Record<PatientStatus, string> = {
  [PatientStatus.Stable]: "יציב",
  [PatientStatus.Unstable]: "לא יציב",
  [PatientStatus.Critical]: "קריטי",
}

export function PatientStatusBadge({ status }: PatientStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2 border rounded-lg px-2 py-1 w-fit">
      <div
        className="w-5 h-5 rounded-md border"
        style={{ backgroundColor: patientStatusColors[status] }}
      />
      <span>{patientStatusLabel[status]}</span>
    </div>
  )
}