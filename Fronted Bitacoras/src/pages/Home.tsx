import React from "react";
import EpemaLogo from "../images/logo-epema.svg";
import { useBitacoras } from "../hooks/useBitacoras";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Home: React.FC = () => {
  const { bitacoras, loading, error } = useBitacoras();

  // Calcular estadísticas
  const totalNovedades = bitacoras.length;
  const turnosActivos = new Set(bitacoras.map((b) => b.turno)).size;

  // Agrupar datos por turno para el gráfico
  const turnosData = Object.entries(
    bitacoras.reduce((acc, bitacora) => {
      acc[bitacora.turno] = (acc[bitacora.turno] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  ).map(([turno, count]) => ({
    turno: `Turno ${turno}`,
    novedades: count,
  }));

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      {/* Logo y Bienvenida */}
      <div className="flex justify-center items-center">
        <img src={EpemaLogo} alt="Epema Logo" className="h-20 w-auto" />
      </div>

      {/* Mostrar carga o error */}
      {loading && <p className="text-center mt-6">Cargando datos...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      {!loading && !error && (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-white shadow-lg rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-700">Total Novedades</h3>
              <p className="text-3xl font-bold text-blue-500">{totalNovedades}</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-700">Turnos Activos</h3>
              <p className="text-3xl font-bold text-green-500">{turnosActivos}</p>
            </div>
          </div>

          {/* Gráfico de novedades por turno */}
          <div className="bg-white shadow-lg rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
              Novedades por Turno
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnosData}>
                <XAxis dataKey="turno" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="novedades" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
