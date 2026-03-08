import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AppSidebar from "./components/atoms/menu/app-sidebar";
import Patients from "./pages/Patients";
import { PatientStatus } from "../types/patinet_status";
import { Patient } from "../types/patient";
import { MachinesPage } from "./pages/Machines";
import { MachineStatus } from "./types/machine-status";

function App() {
  const mockPatients: Patient[] = [
    {
      id: "1",
      name: "פלוני אלמוני",
      city: "תל אביב",
      status: PatientStatus.Stable,
      registred_at: new Date("2025-01-10"),
    },
    {
      id: "2",
      name: "דוד כהן",
      city: "חיפה",
      status: PatientStatus.Unstable,
      registred_at: new Date("2025-02-03"),
    },
    {
      id: "3",
      name: "שרה לוי",
      city: "ירושלים",
      status: PatientStatus.Critical,
      registred_at: new Date("2025-02-15"),
    },
    {
      id: "4",
      name: "משה ישראלי",
      city: "באר שבע",
      status: PatientStatus.Stable,
      registred_at: new Date("2025-03-01"),
    },
    {
      id: "5",
      name: "רונית פרץ",
      city: "נתניה",
      status: PatientStatus.Unstable,
      registred_at: new Date("2025-03-05"),
    },
  ];
  
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarTrigger />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/asd" element={<div>asd</div>} />
          <Route path="/" element={<Patients patients={mockPatients} />} />
          <Route path="/machines" element={<MachinesPage machines={[{id:"1234",name:"פלג",assinged:"123455",location:"home",status:MachineStatus.AVELIABLE}]}/>}/>
        </Routes>
      </SidebarProvider>
    </>
  );
}

export default App;
