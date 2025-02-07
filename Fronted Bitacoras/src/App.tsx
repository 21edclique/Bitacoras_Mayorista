import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
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

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUserData = localStorage.getItem('userData')

    if (savedToken && savedUserData) {
      setToken(savedToken)
      setUserData(JSON.parse(savedUserData))
    }

    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUserData(null)
    setToken(null)
    window.location.href = '/login'
  }, [])

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login setUserData={setUserData} setToken={setToken} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* Sidebar responsivo con animación */}
        <Sidebar
          userData={userData}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : 'ml-0'
          }`}
        >
          {/* Navbar fijo en la parte superior */}
          <Navbar
            handleLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Contenido principal adaptado */}
          <main className="flex-1 overflow-y-auto p-1 pt-200 w-full h-full flex flex-col">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bitacoras" element={<Bitacoras />} />
              <Route
                path="/usuarios"
                element={
                  userData?.id_rol_per === 1 ? <Usuarios /> : <Navigate to="/bitacoras" />
                }
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
