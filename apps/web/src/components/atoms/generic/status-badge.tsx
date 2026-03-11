interface StatusBadgeProps{
    color : string
    label : string
}


const StatusBadge = ({color, label} : StatusBadgeProps) => {
  return (
    <div className="flex items-center gap-2 border rounded-lg px-2 py-1 w-fit">
      <div
        className="w-5 h-5 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  )
}

export default StatusBadge