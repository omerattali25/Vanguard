import { toast } from "sonner"

interface AlertOptions {
    title: string;
    description?: string;
    ttl?: number;
    onAction?: () => void;
}

export const useAlert = ({
    title,
    description,
    ttl = 5000,
    onAction = () => console.log("hi!"),
}: AlertOptions) => {
    toast.warning(title, {

        description,
        duration: ttl,
        action: {
            label: "פתח",
            onClick: () => onAction()
        },
        actionButtonStyle: {
            background: "transparent",
            border: "1px solid #eab308",
            color: "#a16207",
            cursor: "pointer"
        }
    })
}
