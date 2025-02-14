import React, { useState, useEffect } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import EpemaLogo from "../images/logo-epema.svg";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  handleLogout: () => void;
  toggleSidebar: () => void; // Función para abrir/cerrar el sidebar
  isSidebarOpen: boolean;
  isMobile: boolean;
}

interface UserData {
  nombres: string;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout, toggleSidebar }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
          const userData: UserData = JSON.parse(savedUserData);
          setUserName(userData.nombres);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

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
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 z-50 transition-colors shadow-md">
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* 🔥 Botón de menú (solo visible en ≤1024px) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          aria-label="Abrir menú"
        >
          <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* 🔵 Logo */}
        <Link
          to="/home"
          className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <img
            src={EpemaLogo}
            alt="Epema Logo"
            className="h-12 w-auto"
            role="img"
            aria-label="Logo de Epema"
          />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200 hidden md:block">
            EP-EMA
          </span>
        </Link>

        {/* 🟢 Controles de usuario */}
        <div className="flex items-center gap-3">
          {userName && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                Bienvenido👋,
              </span>
              <span
                className="text-lg font-bold text-gray-700 dark:text-gray-200 truncate max-w-[150px] md:max-w-[200px]"
                title={userName}
              >
                {userName}
              </span>
            </div>
          )}

          {/* 🌗 Modo oscuro */}
          <DarkModeToggle />

          {/* 🔴 Botón de salida */}
          <button
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-full transition-all
              ${
                isLoggingOut
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 active:scale-95"
              }`}
            aria-busy={isLoggingOut}
          >
            <FiLogOut className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
