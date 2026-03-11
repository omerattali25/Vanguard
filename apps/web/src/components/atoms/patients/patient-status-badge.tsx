import { PatientStatus } from "../../../../types/patinet_status"
import StatusBadge from "../generic/status-badge"

interface PatientStatusBadgeProps {
  status: PatientStatus
}

const patientStatusColors: Record<PatientStatus, string> = {
  [PatientStatus.Stable]: "#b2f2bb",
  [PatientStatus.Unstable]: "#ffec99",
  [PatientStatus.Critical]: "#fbb4b4",
}

export function PatientStatusBadge({ status }: PatientStatusBadgeProps) {
  return (
    <>
    <StatusBadge color={patientStatusColors[status]} label={status}></StatusBadge>
    </>
  )
}