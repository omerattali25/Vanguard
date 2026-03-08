import { MachineStatus } from "@/types/machine-status"
import StatusBadge from "../generic/status-badge"

interface MachineStatusBadgeProps {
  status: MachineStatus
}

const machineStatusColors: Record<MachineStatus, string> = {
  [MachineStatus.AVELIABLE]: "#b2f2bb",
  [MachineStatus.USED]: "#ffec99",
  [MachineStatus.IN_TRANSFER]: "#fbb4b4",
}

export function MachineStatusBadge({ status }: MachineStatusBadgeProps) {
  return (
    <>
    <StatusBadge color={machineStatusColors[status]} label={status}></StatusBadge>
    </>
  )
}