import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useBitacora from '../../hooks/useBitacoras'; // Hook para obtener datos
import { TypebitacoraT } from '../../types';

const bitacorassList = () => {
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [bitacoraPerPage] = useState(10); // Elementos por página (actualizado a 10)
  const [bitacorasList, setBitacoraList] = useState<TypebitacoraT[]>([]); // Lista completa de cooperativas
  const [loading, setLoading] = useState(true); // Estado de carga
  const { fetchBitacoras } = useBitacora(); // Hook para operaciones de cooperativas

  // Función para obtener todas las cooperativas
  const fetchbitacorass = async () => {
    setLoading(true);
    try {
      const response = await fetchBitacoras(); // Llamada al backend
      if (response) {
        setBitacoraList(response); // Lista completa de cooperativas
      } else {
        setBitacoraList([]); // Lista vacía si no hay respuesta
      }
    } catch (error) {
      toast.error('Error al cargar las bitacoras');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchbitacorass();
  }, []);

  // Calcular las cooperativas a mostrar según la página actual
  const indexofLastBitacora = currentPage * bitacoraPerPage;
  const indexOfFirstbitacoras = indexofLastBitacora - bitacoraPerPage;
  const currentBitacora = bitacorasList.slice(
    indexOfFirstbitacoras,
    indexofLastBitacora
  );

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark">
      <h2 className="text-2xl font-bold mb-6 text-center">Lista de Bitacoras</h2>

      <div className="w-full h-[600px] overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-strokedark">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Nro Bitacora</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Usuario</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Hora</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Nave</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Camara</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Nave</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Novedad</th>



            </tr>
          </thead>
          <tbody>
            {currentBitacora.map((bitacoras) => (
              <tr key={bitacoras.id_bitacora} className="border-t border-gray-200 dark:border-strokedark">
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.id_bitacora}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.fecha}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.id_usuario_per}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.hora}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.id_nave_per}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.id_nave_per}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.camara}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{bitacoras.novedad}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => paginate(1)}
          className="px-4 py-2 bg-[#791812] text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-[#791812] text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {Array.from(
          { length: Math.ceil(bitacorasList.length / bitacoraPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                currentPage === index + 1
                  ? 'bg-[#791812] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-[#791812] text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === Math.ceil(bitacorasList.length / bitacoraPerPage)}
        >
          {">"}
        </button>
        <button
          onClick={() => paginate(Math.ceil(bitacorasList.length / bitacoraPerPage))}
          className="px-4 py-2 bg-[#791812] text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === Math.ceil(bitacorasList.length / bitacoraPerPage)}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default bitacorassList;
