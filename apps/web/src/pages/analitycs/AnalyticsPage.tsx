import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import React from 'react'
import StatsCard from "@/components/atoms/analytics/stats-card";

const Analytics = () => {
  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">סטטיסטיקות</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="מטופל שהיה מחובר הכי הרבה זמן" value="128" />
        <StatsCard title="מטופל שהיה מחובר הכי פחות זמן" value="6" />
        <StatsCard title="מכונה הכי משומשת" value="82 BPM" />
        <StatsCard title="מכונה הכי פחות משומשת" value="97%" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Vitals Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Graph will be here
          </div>
        </CardContent>
      </Card>

      {/* Alerts table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>

        <CardContent>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Vital</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Heart Rate</TableCell>
                <TableCell>130</TableCell>
                <TableCell>
                  <Badge variant="destructive">
                    Critical
                  </Badge>
                </TableCell>
                <TableCell>12:32</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Alice</TableCell>
                <TableCell>SpO2</TableCell>
                <TableCell>88%</TableCell>
                <TableCell>
                  <Badge variant="destructive">
                    Low
                  </Badge>
                </TableCell>
                <TableCell>12:30</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Bob</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>38.9</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    Warning
                  </Badge>
                </TableCell>
                <TableCell>12:28</TableCell>
              </TableRow>

            </TableBody>
          </Table>

        </CardContent>
      </Card>

    </div>
  )
}

export default Analytics