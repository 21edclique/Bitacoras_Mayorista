import React, { useMemo } from 'react'
import { useBitacoras } from '../hooks/useBitacoras'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6699']

const Home: React.FC = () => {
  const { bitacoras, loading, error } = useBitacoras()

  // Calcular estadísticas
  const {
    totalNovedades,
    turnosActivos,
    novedadesResueltas,
    novedadesPendientes,
    ultimaFecha,
    turnosData,
    camarasData,
  } = useMemo(() => {
    const totalNovedades = bitacoras.length
    const turnosSet = new Set<number>()
    const camarasCount: Record<string, number> = {}
    let novedadesResueltas = 0
    let ultimaFecha = ''

    bitacoras.forEach(({ turno, resultado, camara, fecha }) => {
      turnosSet.add(turno)
      if (resultado.toLowerCase() === 'resuelto') novedadesResueltas++
      camarasCount[camara] = (camarasCount[camara] || 0) + 1
      ultimaFecha = fecha > ultimaFecha ? fecha : ultimaFecha
    })

    const turnosData = Array.from(turnosSet).map((turno) => ({
      turno: `Turno ${turno}`,
      novedades: bitacoras.filter((b) => b.turno === turno).length,
    }))

    const camarasData = Object.entries(camarasCount).map(([camara, count]) => ({
      camara,
      novedades: count,
    }))

    return {
      totalNovedades,
      turnosActivos: turnosSet.size,
      novedadesResueltas,
      novedadesPendientes: totalNovedades - novedadesResueltas,
      ultimaFecha: new Date(ultimaFecha).toLocaleDateString(),
      turnosData,
      camarasData,
    }
  }, [bitacoras])

  return (
    <main className="p-1 sm:p-2 md:p-2 lg:p-2 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto">
  <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-20">
        {loading && (
          <p className="text-center mt-4 text-gray-600 dark:text-gray-300">Cargando datos...</p>
        )}
        {!!error && <p className="text-center text-red-500 mt-4">{error}</p>}
  
        {!loading && !error && (
          <>
            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
              {[
                { label: 'Total Novedades', value: totalNovedades, color: 'text-blue-500' },
                { label: 'Turnos Activos', value: turnosActivos, color: 'text-green-500' },
                { label: 'Resueltas', value: novedadesResueltas, color: 'text-purple-500' },
                { label: 'Pendientes/No Resueltas', value: novedadesPendientes, color: 'text-red-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 text-center">
                  <h3 className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</h3>
                  <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
  
            {/* Última actualización */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 mt-4 sm:mt-6 text-center">
              <h3 className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Última Novedad Registrada</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-400">
                {ultimaFecha || 'No disponible'}
              </p>
            </div>
  
            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {/* Gráfico de novedades por turno */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4">
                <h3 className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-3 sm:mb-4">
                  Novedades por Turno
                </h3>
                <ResponsiveContainer width="100%" height={250}>
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
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4">
                <h3 className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-3 sm:mb-4">
                  Novedades por Cámara
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={camarasData} dataKey="novedades" nameKey="camara" outerRadius={100} label>
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
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
              <h3 className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-3 sm:mb-4">
                Novedades Pendientes o No Resueltas
              </h3>
  
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-600 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                      {['ID', 'Fecha', 'Turno', 'Cámara', 'Novedad', 'Estado'].map((header) => (
                        <th key={header} className="px-2 sm:px-4 py-2 text-left text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
  
                  <tbody>
                    {bitacoras
                      .filter((b) => b.resultado !== 'Resuelto')
                      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                      .map(({ id_bitacora, fecha, turno, camara, novedad, resultado }) => (
                        <tr
                          key={id_bitacora}
                          className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">{id_bitacora}</td>
                          <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
                            {new Date(fecha).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">{`Turno ${turno}`}</td>
                          <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">{camara}</td>
                          <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-gray-300 text-sm sm:text-base">{novedad}</td>
                          <td className={`px-2 sm:px-4 py-2 font-bold text-sm sm:text-base ${resultado.toLowerCase() === 'resuelto' ? 'text-green-500 dark:text-green-400' : resultado.toLowerCase() === 'pendiente' ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
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
  
}

export default Home
