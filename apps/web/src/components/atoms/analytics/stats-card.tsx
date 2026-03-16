import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import React from 'react'

interface StatsCardProps {
    title: string;
    value: string | number;
}

const StatsCard : React.FC<StatsCardProps> = ({ title, value }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}

export default StatsCard