import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Menu = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-3 gap-4">
          {/* Contenido de la pantalla */}
        </div>
      </div>
    </>
  );
};

export default Menu;
