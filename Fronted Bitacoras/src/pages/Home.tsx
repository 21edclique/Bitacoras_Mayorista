import React, { useMemo } from "react";
import { useBitacoras } from "../hooks/useBitacoras";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

const Home: React.FC = () => {
  const { bitacoras, loading, error } = useBitacoras();

  // Calcular estadísticas
  const { totalNovedades, turnosActivos, novedadesResueltas, novedadesPendientes, ultimaFecha, turnosData, camarasData } = useMemo(() => {
    const totalNovedades = bitacoras.length;
    const turnosSet = new Set<number>();
    const camarasCount: Record<string, number> = {};
    let novedadesResueltas = 0;
    let ultimaFecha = "";

    bitacoras.forEach(({ turno, resultado, camara, fecha }) => {
      turnosSet.add(turno);
      if (resultado.toLowerCase() === "resuelto") novedadesResueltas++;
      camarasCount[camara] = (camarasCount[camara] || 0) + 1;
      ultimaFecha = fecha > ultimaFecha ? fecha : ultimaFecha;
    });

    const turnosData = Array.from(turnosSet).map(turno => ({
      turno: `Turno ${turno}`,
      novedades: bitacoras.filter(b => b.turno === turno).length,
    }));

    const camarasData = Object.entries(camarasCount).map(([camara, count]) => ({
      camara,
      novedades: count,
    }));

    return {
      totalNovedades,
      turnosActivos: turnosSet.size,
      novedadesResueltas,
      novedadesPendientes: totalNovedades - novedadesResueltas,
      ultimaFecha: new Date(ultimaFecha).toLocaleDateString(),
      turnosData,
      camarasData,
    };
  }, [bitacoras]);

  return (
    <main className="ml-10 mt-24 p-6 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto p-6">
        {loading && <p className="text-center mt-6 text-gray-600 dark:text-gray-300">Cargando datos...</p>}
        {!!error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {!loading && !error && (
          <>
            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {[
                { label: "Total Novedades", value: totalNovedades, color: "text-blue-500" },
                { label: "Turnos Activos", value: turnosActivos, color: "text-green-500" },
                { label: "Resueltas", value: novedadesResueltas, color: "text-purple-500" },
                { label: "Pendientes", value: novedadesPendientes, color: "text-red-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</h3>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Última actualización */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Última Novedad Registrada</h3>
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{ultimaFecha || "No disponible"}</p>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Gráfico de novedades por turno */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-4">Novedades por Turno</h3>
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

              {/* Gráfico de novedades por cámara */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-4">Novedades por Cámara</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={camarasData} dataKey="novedades" nameKey="camara" outerRadius={120} label>
                      {camarasData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabla de novedades recientes */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-4">Últimas Novedades</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 border-b">
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Turno</th>
                      <th className="px-4 py-2 text-left">Cámara</th>
                      <th className="px-4 py-2 text-left">Novedad</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bitacoras.slice(0, 5).map(({ id_bitacora, fecha, turno, camara, novedad, resultado }) => (
                      <tr key={id_bitacora} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-2">{new Date(fecha).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{`Turno ${turno}`}</td>
                        <td className="px-4 py-2">{camara}</td>
                        <td className="px-4 py-2">{novedad}</td>
                        <td className={`px-4 py-2 font-bold ${resultado.toLowerCase() === "resuelto" ? "text-green-500" : "text-red-500"}`}>
                          {resultado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
