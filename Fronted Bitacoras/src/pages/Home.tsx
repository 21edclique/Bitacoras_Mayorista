import React from 'react';
import EpemaLogo from '../images/logo-epema.svg'

const Home: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-6 flex justify-center items-center">
      {/* <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Bienvenido a la Página de Inicio</h2> */}
  <br />

  <img 
  src={EpemaLogo} 
  alt="Epema Logo" 
  className="h-45 w-auto mr-3" 
/>
</div>

    
  );
};

export default Home;
