import { useAlert } from "../../../hooks/use-alert";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { Toaster } from 'sonner';

const socket = io('http://localhost:3001');

const AlertsToaster = () => {
  useEffect(() => {
    socket.emit("join", `alerts`);

    socket.on("alerts", useAlert);
    
    return () => {
      socket.off("alerts", useAlert);
      socket.emit("leave", `alerts`);
    };
  }, []);
  return (
    <Toaster position="bottom-right" richColors closeButton theme='system' visibleToasts={5} />
  )
}

export default AlertsToaster