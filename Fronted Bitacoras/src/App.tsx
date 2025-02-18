import { useState, useEffect, useCallback } from 'react'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Bitacoras from './pages/Bitacoras'
import Login from './pages/Login'
import Usuarios from './pages/Usuarios'
import './App.css'

const App: React.FC = () => {
  const [userData, setUserData] = useState<{ id_rol_per: number; nombre: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth >= 1024)

  // Efecto para manejar el estado del token y los datos del usuario
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUserData = localStorage.getItem('userData')

    if (savedToken && savedUserData) {
      setToken(savedToken)
      setUserData(JSON.parse(savedUserData))
    }
  }, [])

  // Efecto para manejar el tamaño de la pantalla y el estado del Sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Función para cerrar sesión
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUserData(null)
    setToken(null)
    window.location.href = '/'
  }, [])

  // Si no hay token, redirigir al login
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login setUserData={setUserData} setToken={setToken} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar responsivo */}
        <Sidebar
          userData={userData}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobile={window.innerWidth < 1024}
        />

        {/* Contenido principal */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? 'lg:ml-64' : 'ml-0'
          }`}
        >
          {/* Navbar fijo en la parte superior */}
          <Navbar
            handleLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            isMobile={window.innerWidth < 1024}
          />

          {/* Contenido principal con scroll horizontal en móviles */}
          <main
            className="flex-1 overflow-x-auto overflow-y-auto p-10 max-w-full"
          >
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bitacoras" element={<Bitacoras />} />
              <Route
                path="/usuarios"
                element={userData?.id_rol_per === 1 ? <Usuarios /> : <Navigate to="/bitacoras" />}
              />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
