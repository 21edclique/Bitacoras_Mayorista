import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Bitacoras from "./pages/Bitacoras";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import "./App.css";

const App: React.FC = () => {
  const [userData, setUserData] = useState<{ id_rol_per: number; nombre: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth >= 768);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserData = localStorage.getItem("userData");

    if (savedToken && savedUserData) {
      setToken(savedToken);
      setUserData(JSON.parse(savedUserData));
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // En móviles, Sidebar cerrado por defecto
      } else {
        setIsSidebarOpen(true); // En escritorio, Sidebar abierto siempre
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData(null);
    setToken(null);
    window.location.href = "/login";
  }, []);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUserData={setUserData} setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
        
        {/* Sidebar mantiene su diseño original, pero en móviles se oculta hasta que se active */}
        <Sidebar 
          userData={userData} 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <div className={`flex-1 flex flex-col transition-all duration-300 
          ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
          
          {/* Navbar con botón para abrir/cerrar Sidebar en móviles */}
          <Navbar 
            handleLogout={handleLogout} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          
          <main className="flex-1 overflow-y-auto p-4 pt-20">
            <div className="container mx-auto">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/bitacoras" element={<Bitacoras />} />
                <Route 
                  path="/usuarios" 
                  element={userData?.id_rol_per === 1 ? <Usuarios /> : <Navigate to="/bitacoras" />} 
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </main>

        </div>
      </div>
    </Router>
  );
};

export default App;
