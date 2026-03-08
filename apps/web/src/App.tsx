import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import AppSidebar from './components/atoms/app-sidebar';
import { AddMachineForm } from './components/atoms/machines/add-machine-form';

function App() {

  return (
    <>
    <SidebarProvider defaultOpen={false}>
      
        <AppSidebar>

        </AppSidebar>
        <SidebarTrigger></SidebarTrigger>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/asd" element={<div>asd</div>} />
      </Routes>
      </SidebarProvider>
    </>
  )
}

export default App
