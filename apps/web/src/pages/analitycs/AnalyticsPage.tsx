import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatsCard from "@/components/atoms/analytics/stats-card";
import { useLeastConnectedPatient, useMostUsedMachine, usePatientAnalytics, usePatientsPerDay } from "api/analytics/statistics/statistics.query";
import LineGraph from "@/components/atoms/graphs/line-graph";
import LoadingPage from "@/components/atoms/generic/loading-page";

const Analytics = () => {
  const { data: mostConnectedPatient, isPending: isMostConnectedPatientPending, error: mostConnectedPatientError } = usePatientAnalytics();
  const { data: leastConnectedPatient, isPending: isLeastConnectedPatientPending, error: leastConnectedPatientError } = useLeastConnectedPatient();
  const { data: mostUsedMachine, isPending: isMostUsedMachinePending, error: mostUsedMachineError } = useMostUsedMachine();
  const { data: patientsPerDay, isPending: isPatientsPerDayPending, error: patientsPerDayError } = usePatientsPerDay();

  if (isMostConnectedPatientPending || isLeastConnectedPatientPending || isMostUsedMachinePending || isPatientsPerDayPending) {
    return <LoadingPage />
  }
  if (mostConnectedPatientError || leastConnectedPatientError || mostUsedMachineError || patientsPerDayError) {
    return <div>שגיאה: {mostConnectedPatientError?.message || leastConnectedPatientError?.message || mostUsedMachineError?.message || patientsPerDayError?.message}</div>
  }
  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">סטטיסטיקות</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="מטופל שהיה מחובר הכי הרבה זמן" value={mostConnectedPatient?.name || "N/A"} />
        <StatsCard title="מטופל שהיה מחובר הכי פחות זמן" value={leastConnectedPatient?.name || "N/A"} />
        <StatsCard title="מכונה הכי משומשת" value={mostUsedMachine?.name || "N/A"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>כמות מטופלים חדשים לפי יום</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <LineGraph
              data={patientsPerDay?.size
                ? Array.from(patientsPerDay.entries()).map(
                  ([time, count]) => ({
                    time: new Date(time).toLocaleDateString(),
                    vitalSign: count,
                  })
                )
                : []}
              datakey="כמות אנשים"
              y_domain={0}
              medical_units=""
              stroke="#4b4192"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default Analytics