import React from 'react'
import { useBitacoras } from '../hooks/useBitacoras'
import ModalBitacoras from '../Mod/ModalBitacoras'
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'

type IconButtonProps = {
  children: React.ReactNode
  onClick: () => void
  color?: 'default' | 'edit' | 'delete'
  ariaLabel: string
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  color = 'default',
  ariaLabel,
}) => {
  const colorStyles: { [key in 'default' | 'edit' | 'delete']: string } = {
    default: 'text-gray-600 hover:bg-gray-200',
    edit: 'text-yellow-600 hover:bg-yellow-100',
    delete: 'text-red-600 hover:bg-red-100',
  }

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${colorStyles[color]}`}
    >
      {children}
    </button>
  )
}

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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  )

  const totalPages = Math.ceil(bitacoras.length / itemsPerPage)

  const handlePrevPage = () => currentPage > 1 && paginate(currentPage - 1)
  const handleNextPage = () => currentPage < totalPages && paginate(currentPage + 1)

  const getPageRange = () => {
    const range = []
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i)
    }

    return range
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Bitácoras</h1>
            <button
              onClick={() => {
                handleAddBitacora()
                setShowForm(true)
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Agregar Bitácora</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bitácora</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fecha</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Usuario</th>
                    <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Hora</th>
                    <th scope="col" className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nave</th>
                    <th scope="col" className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cámara</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Novedad</th>
                    <th scope="col" className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Resultado</th>
                    <th scope="col" className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Referencia</th>
                    <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Turno</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((bitacora) => (
                    <tr key={bitacora.id_bitacora} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.id_bitacora}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.fecha}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.nombres}</td>
                      <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.hora}</td>
                      <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.nombre || 'N/A'}</td>
                      <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.camara}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate">{bitacora.novedad}</div>
                      </td>
                      <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.resultado}</td>
                      <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.referencia}</td>
                      <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-900">{bitacora.turno}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <IconButton onClick={() => handleEdit(bitacora)} color="edit" ariaLabel="Editar">
                            <Pencil className="h-5 w-5" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(bitacora.id_bitacora)} color="delete" ariaLabel="Eliminar">
                            <Trash2 className="h-5 w-5" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <nav className="flex items-center justify-between mt-6" aria-label="Pagination">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, bitacoras.length)}
                  </span>
                  {' '}de{' '}
                  <span className="font-medium">{bitacoras.length}</span>
                  {' '}resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {getPageRange().map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </nav>
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