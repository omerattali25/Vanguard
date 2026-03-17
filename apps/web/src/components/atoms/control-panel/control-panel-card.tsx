import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import React from 'react'
import { useNavigate } from 'react-router-dom';

interface ControlPanelCardProps {
    title: string;
    description: string;
    buttonText: string;
    navigateTo: string;
}

const ControlPanelCard : React.FC<ControlPanelCardProps> = ({ title, description, buttonText, navigateTo }) => {
    const navigate = useNavigate();
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <p>{description}</p>

                <button className='px-4 py-2 rounded-md bg-black text-white font-medium shadow hover:bg-blue-900 ' onClick={() => navigate(navigateTo)}>
                    {buttonText}
                </button>
            </CardContent>
        </Card>
    )
}

export default ControlPanelCard