import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'sonner';
import { AlertPage } from './pages/AlertPage';


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alerts" element={<AlertPage/>} />
      </Routes>
      <Toaster position="bottom-right" richColors closeButton theme='system' visibleToasts={5} />
    </>
  )
}

export default App
