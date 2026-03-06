import { Button } from '@/components/ui/button'
import { useAlert } from '@/hooks/use-alert';
import { useNavigate } from 'react-router-dom'

export const AlertPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Button onClick={() =>
                useAlert({
                    title: "מטופל 32132 בסכנה",
                    description: "לחץ דם אינו תקין",
                    ttl: 5000,
                    onAction: () => navigate("/alerts")
                })
            }>
                התראה לדוגמא
            </Button>
        </div>
    )
}
