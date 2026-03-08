import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import AppSidebar from './components/atoms/app-sidebar';
import { Menu, PanelRight } from 'lucide-react';
import { Button } from './components/ui/button';

function App() {

  return (
    <>
    <SidebarProvider defaultOpen={false}>
      
        <AppSidebar>

        </AppSidebar>
        <SidebarTrigger>
      </SidebarTrigger>

      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </SidebarProvider>
    </>
  )
}

export default App
