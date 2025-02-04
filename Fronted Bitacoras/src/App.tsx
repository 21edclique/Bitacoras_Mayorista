import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Bitacoras from './pages/Bitacoras';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [userData, setUserData] = useState<{ id_rol_per: number, nombre: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserData = localStorage.getItem('userData');
    if (savedToken && savedUserData) {
      setToken(savedToken);;
      setUserData(JSON.parse(savedUserData)); // Guardamos el usuario con su rol
      console.log('Datos guardados en localStorage:', { token: savedToken, userData: savedUserData });  // Aquí se imprime lo guardado en localStorage
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
          <Sidebar userData={userData} /> {/* Aquí pasas userData */}
      

        <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
          <Navbar />\
          <br />
          <br />
          <div className="p-6">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bitacoras" element={<Bitacoras />} />
              {userData?.id_rol_per === 1 ? (
                <Route path="/usuarios" element={<Usuarios />} />
              ) : (
                <Route path="/usuarios" element={<Navigate to="/bitacoras" />} />
              )}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
