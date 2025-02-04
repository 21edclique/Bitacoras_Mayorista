import React from 'react'
import { useBitacoras } from '../hooks/useBitacoras'
import ModalBitacoras from '../Mod/ModalBitacoras'
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react'

const IconButton = ({
  children,
  onClick,
  color = 'default',
  ariaLabel
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: 'default' | 'edit' | 'delete';
  ariaLabel: string;
}) => {
  const colorStyles = {
    default: 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700',
    edit: 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900',
    delete: 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900'
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${colorStyles[color]}`}
    >
      {children}
    </button>
  );
};

const Bitacoras = () => {
  const {
    bitacoras,
    loading,
    error,
    currentPage,
    itemsPerPage,
    showForm,
    editMode,
    formData,
    currentItems,
    handleInputChange,
    handleAddBitacora,
    handleSubmit,
    handleDelete,
    handleEdit,
    paginate,
    setShowForm,
  } = useBitacoras()

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  )

  const totalPages = Math.ceil(bitacoras.length / itemsPerPage)
  const getPageRange = () => {
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bitácoras</h1>
            <button
              onClick={() => {
                handleAddBitacora()
                setShowForm(true)
              }}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                       text-white px-4 py-2 rounded-lg transition-colors duration-300 
                       flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Agregar Bitácora</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {Object.entries({
                      'id_bitacora': 'Bitácora',
                      'fecha': 'Fecha',
                      'nombres': 'Usuario',
                      'hora': 'Hora',
                      'nombre': 'Nave',
                      'camara': 'Cámara',
                      'novedad': 'Novedad',
                      'resultado': 'Resultado',
                      'referencia': 'Referencia',
                      'turno': 'Turno'
                    }).map(([key, label]) => (
                      <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                        {label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((bitacora) => (
                    <tr key={bitacora.id_bitacora} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      {Object.keys(bitacora).map((key) => (
                        <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {bitacora[key]}
                        </td>
                      ))}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <IconButton onClick={() => handleEdit(bitacora)} color="edit" ariaLabel="Editar">
                            <Edit2 size={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(bitacora.id_bitacora)} color="delete" ariaLabel="Eliminar">
                            <Trash2 size={18} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, bitacoras.length)} de {bitacoras.length} bitácoras
            </p>

            <nav className="flex items-center gap-2" aria-label="Paginación">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <ChevronLeft size={20} />
              </button>

              {getPageRange().map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 
                    ${currentPage === page 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        </div>
      </div>

      <ModalBitacoras
        showForm={showForm}
        editMode={editMode}
        formData={formData}
        setShowForm={setShowForm}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default Bitacoras