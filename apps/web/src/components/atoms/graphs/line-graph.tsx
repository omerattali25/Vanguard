import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LineGraphProps {
    data: { time: string, vitalSign: number }[]
    datakey: string
    y_domain:number
    medical_units : string
    stroke?: string
}

const LineGraph: React.FC<LineGraphProps> = ({ data, datakey, y_domain, medical_units, stroke }: LineGraphProps) => {
    return (
        <div className="w-full h-[400px] p-4 bg-white rounded-2xl shadow">
            <h2 className="text-center font-semibold mb-2"> {datakey} </h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[y_domain, "auto"]} label={{ value: datakey, angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => `${value} ${medical_units}`}/>
                    <Line
                        type="monotone"
                        dataKey="vitalSign"
                        stroke={stroke || "#a92e2e"}
                        strokeWidth={2}
                        name={datakey}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineGraph