import React, { useState, useEffect } from 'react'
import { FiLogOut } from 'react-icons/fi'
import EpemaLogo from '../images/logo-epema.svg'
import useLogout from '../hooks/useLogout'
import { Link } from 'react-router-dom'

interface UserData {
  nombres: string
  // Agrega aquí otros campos del usuario si es necesario
}

const Navbar = () => {
  const { handleLogout } = useLogout()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('') // Mejor inicializar con string vacío

  // Optimización: Evitar acceso directo a localStorage en el render
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserData = localStorage.getItem('userData')
        if (savedUserData) {
          const userData: UserData = JSON.parse(savedUserData)
          setUserName(userData.nombres) // Usar el campo correcto (nombres)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    
    loadUserData()
    // Escuchar cambios en el storage (por si se actualiza en otra pestaña)
    window.addEventListener('storage', loadUserData)
    return () => window.removeEventListener('storage', loadUserData)
  }, [])

  const onLogoutClick = async () => {
    setIsLoggingOut(true)
    setError(null)

    try {
      const success = await handleLogout()
      if (success) {
        // Mejor práctica: Usar navigate de react-router en lugar de window.location
        window.location.href = '/login'
      }
    } catch (err) {
      setError('Error al cerrar sesión')
      // Auto-eliminar el error después de 5 segundos
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white p-4 z-50 shadow-md dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo con enlace accesible */}
        <div className="flex items-center">
      <Link to="/home">
        <img 
          src={EpemaLogo} 
          alt="Epema Logo" 
          className="h-12 mr-3 cursor-pointer"
          role="img"
          aria-label="Logo de Epema"
        />
      </Link>
    </div>

        {/* Sección de usuario */}
        <div className="flex items-center gap-4">
          {/* Nombre del usuario con truncado para responsive */}
          {userName && (
            <span 
              className="text-lg font-semibold text-gray-900 truncate max-w-[200px] dark:text-white"
              title={userName}
            >
              Hola, {userName}
            </span>
          )}

          {/* Mensaje de error con animación */}
          {error && (
            <div
              className="text-red-500 text-sm font-semibold bg-red-100 px-3 py-2 rounded-md dark:bg-red-900 dark:text-red-300 animate-fade-in"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {/* Botón de logout mejorado */}
          <button
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className={`flex items-center gap-2 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all ${
              isLoggingOut 
                ? 'bg-red-600 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            aria-busy={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Spinner />
                Saliendo...
              </>
            ) : (
              <>
                <FiLogOut className="w-5 h-5" aria-hidden="true" />
                <span>Salir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

// Componente Spinner reutilizable
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="status"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0116 0H4"
    />
  </svg>
)

export default React.memo(Navbar) // Optimización de rendimiento