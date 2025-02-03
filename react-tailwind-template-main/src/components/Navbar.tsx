import React, { useState, useEffect } from "react"; 
import { FiLogOut } from "react-icons/fi"; // Ícono de logout
import EpemaLogo from "../images/logo-epema.svg";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { handleLogout } = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Para almacenar el nombre del usuario

  // Obtén los datos del usuario desde localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      console.log("User Data en Navbar:", userData); // Imprime el userData en la consola
      setUserName(userData?.name || "Usuario");
    }
  }, []);

  const onLogoutClick = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const success = await handleLogout();
      if (success) {
        window.location.href = "/login"; // Redirige al login
      } else {
        setError("Error al cerrar sesión");
      }
    } catch (err) {
      setError("Error al cerrar sesión");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white p-4 z-50 shadow-md dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={EpemaLogo} alt="Epema Logo" className="h-12 mr-3" />
        </div>

        {/* Sección de usuario y logout */}
        <div className="flex items-center space-x-4">
          {/* Mostrar nombre del usuario */}
          {userName && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Hola, {userName}
            </span>
          )}

          {/* Mensaje de error */}
          {error && (
            <div
              className="text-red-500 text-sm font-semibold bg-red-100 px-3 py-2 rounded-md dark:bg-red-900 dark:text-red-300"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className="flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 disabled:opacity-50"
            aria-label={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
                    d="M4 12a8 8 0 0116 0"
                  />
                </svg>
                Saliendo...
              </>
            ) : (
              <>
                <FiLogOut className="w-5 h-5" />
                Salir
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
