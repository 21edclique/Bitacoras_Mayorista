import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FcKindle, FcBusinessman } from "react-icons/fc";
import { FcStatistics } from "react-icons/fc";

interface SidebarItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface SidebarProps {
  userData: { id_rol_per: number } | null;
  isOpen: boolean; // Nuevo
  toggleSidebar: () => void; // Nuevo
}


const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-4 p-4 text-lg font-semibold text-gray-900 rounded-xl dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105"
      aria-label={label}
    >
      <Icon className="w-8 h-8" />
      <span className="ms-3">{label}</span>
    </Link>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ userData, isOpen, toggleSidebar }) => {
  const [systemDarkMode, setSystemDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateDarkMode = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches);

    darkModeQuery.addEventListener('change', updateDarkMode);
    return () => darkModeQuery.removeEventListener('change', updateDarkMode);
  }, []);

  useEffect(() => {
    if (systemDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [systemDarkMode]);

  return (
<aside
  id="logo-sidebar"
  className="fixed top-0 left-0 w-72 h-screen pt-20 bg-white border-r border-gray-200 shadow-lg sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700"
>
  <div className="h-full px-4 pb-6 overflow-y-auto bg-white dark:bg-gray-900">
    <br />
    <div className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
      Menú Principal
    </div>
    <ul className="space-y-4 font-medium">
      <SidebarItem to="/home" icon={FcStatistics} label="Dashboard" />
      <SidebarItem to="/bitacoras" icon={FcKindle} label="Bitácoras" />
      {userData?.id_rol_per === 1 && (
        <SidebarItem to="/usuarios" icon={FcBusinessman} label="Usuarios" />
      )}
    </ul>
  </div>
</aside>

  );
};

export default Sidebar;
