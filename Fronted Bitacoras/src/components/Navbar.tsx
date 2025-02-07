import React, { useState, useEffect } from 'react';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi'; // Importar iconos
import { Link } from 'react-router-dom';
import EpemaLogo from '../images/logo-epema.svg';

// Definir las props del Navbar
interface NavbarProps {
  handleLogout: () => void;
}

interface UserData {
  nombres: string;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          const userData: UserData = JSON.parse(savedUserData);
          setUserName(userData.nombres);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, []);

  // Aplicar modo oscuro en el `html`
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const onLogoutClick = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      await handleLogout();
    } catch (err) {
      setError("Error al cerrar sesión");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white p-6 shadow-lg z-50 dark:bg-gray-900 transition-all">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-3">
          <img 
            src={EpemaLogo} 
            alt="Epema Logo" 
            className="h-10 w-auto cursor-pointer transition-transform hover:scale-105"
            role="img"
            aria-label="Logo de Epema"
          />
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">EP-EMA</span>
        </Link>

        {/* Sección de usuario */}
        <div className="flex items-center space-x-6">
          {/* Botón Modo Oscuro */}
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            aria-label="Cambiar modo de color"
          >
            {darkMode ? <FiSun className="text-yellow-400 w-6 h-6" /> : <FiMoon className="text-gray-800 dark:text-gray-100 w-6 h-6" />}
          </button>

          {/* Nombre del usuario */}
          {userName && (
            <span 
              className="text-lg font-medium text-gray-900 truncate max-w-[400px] dark:text-gray-100 hidden sm:block"
              title={userName}
            >
              👋 Hola, {userName}
            </span>
          )}

          {/* Mensaje de error */}
          {error && (
            <div
              className="text-red-500 text-sm font-medium bg-red-100 px-4 py-2 rounded-lg dark:bg-red-800 dark:text-red-300 animate-fade-in"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {/* Botón de logout */}
          <button
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className={`flex items-center gap-2 px-5 py-2 text-white font-semibold rounded-full shadow-md transition-all transform ${
              isLoggingOut 
                ? 'bg-red-600 cursor-not-allowed opacity-70' 
                : 'bg-red-500 hover:bg-red-600 hover:scale-105'
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
  );
};

// Componente Spinner (mejorado)
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
);

export default React.memo(Navbar);
