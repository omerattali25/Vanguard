import { MachineStatus } from "@/types/machine-status"
import StatusBadge from "../generic/status-badge"

interface MachineStatusBadgeProps {
  status: MachineStatus
}

const machineStatusColors: Record<MachineStatus, string> = {
  [MachineStatus.AVALIBLE]: "#b2f2bb",
  [MachineStatus.USED]: "#ffec99",
  [MachineStatus.IN_TRANSFER]: "#fbb4b4",
}

export const machineStatusLabels: Record<MachineStatus, string> = {
  [MachineStatus.AVALIBLE]:"פנוי",
  [MachineStatus.USED]: "תפוס",
  [MachineStatus.IN_TRANSFER]: "בתנועה",
}

export function MachineStatusBadge({ status }: MachineStatusBadgeProps) {
  return (
    <>
    <StatusBadge color={machineStatusColors[status]} label={machineStatusLabels[status]}></StatusBadge>
    </>
  )
}