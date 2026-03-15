import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AppSidebar from "./components/atoms/menu/app-sidebar";
import Patients from "./pages/Patients";
import PatientVitals from "./pages/PatientVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import PatientAnalyticsPage from "./pages/analitycs/PatientAnalytics";
import MachinesAnalyticsPage from "./pages/analitycs/MachinesAnalyticsPage";
import {MachinesPage} from './pages/Machines'



function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />

          <SidebarTrigger></SidebarTrigger>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/analytics/patients/:id" element={<PatientAnalyticsPage />} />
            <Route path="/analytics/machines" element={<MachinesAnalyticsPage />} />
            <Route path="/patients/:id" element={<PatientVitals />} />
            <Route path="/machines" element={<MachinesPage/>}/>
          </Routes>
        </SidebarProvider>
        <Toaster position="bottom-right" richColors closeButton theme='system' visibleToasts={5} />
        <footer className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; MoReDis.</p>
          </div>
        </footer>
      </QueryClientProvider>
    </>
  );
}

export default App;
