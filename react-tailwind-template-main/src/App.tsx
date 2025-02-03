// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Bitacoras from './pages/Bitacoras';
import Login from './components/Login';
import Usuarios from './pages/Usuarios';

function App() {
  const [userData, setUserData] = useState<{ id_rol_per: number } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserData = localStorage.getItem('userData');

    if (savedToken && savedUserData) {
      setToken(savedToken);
      setUserData(JSON.parse(savedUserData)); // Guardamos el usuario con su rol
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUserData(null);
    setToken(null);
    window.location.href = '/login';
  };

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
      <div className="flex h-screen">
        {/* Sidebar con userData como prop */}
        <aside className="w-64 fixed h-full bg-gray-800 text-white">
          <Sidebar userData={userData} /> {/* Aquí pasas userData */}
        </aside>

        {/* Contenedor principal con margen para que no se solape con el sidebar */}
        <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
          <Navbar />
          <div className="p-6">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bitacoras" element={<Bitacoras />} />

              {/* Solo los administradores pueden ver Usuarios */}
              {userData?.id_rol_per === 1 ? (
                <Route path="/usuarios" element={<Usuarios />} />
              ) : (
                <Route path="/usuarios" element={<Navigate to="/bitacoras" />} />
              )}

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
