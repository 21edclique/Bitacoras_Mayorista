import React, { useState } from 'react'
import { useBitacoras } from '../hooks/useBitacoras'
import ModalBitacoras from '../Mod/ModalBitacoras'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'

const IconButton = ({
  children,
  onClick,
  color = 'default',
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  color?: 'default' | 'edit' | 'delete'
  ariaLabel: string
}) => {
  const colorStyles = {
    default: 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700',
    edit: 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900',
    delete: 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900',
  }
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${colorStyles[color]}`}
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
    handleInputChange,
    handleAddBitacora,
    handleSubmit,
    handleDelete,
    handleEdit,
    paginate,
    setShowForm,
  } = useBitacoras()

  const [goToPage, setGoToPage] = useState('')

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  // Ordenar bitácoras por fecha descendente (más recientes primero)
  const sortedBitacoras = [...bitacoras].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )

  const totalPages = Math.ceil(sortedBitacoras.length / itemsPerPage)
  const currentItems = sortedBitacoras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <main className="ml-10 mt-24 p-6 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bitácoras</h1>
              <button
                onClick={() => {
                  handleAddBitacora()
                  setShowForm(true)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Agregar Bitácora</span>
              </button>
            </div>

            {/* Contenido */}
            <div className="grid gap-1">
              {currentItems.map((bitacora) => (
                <div
                  key={bitacora.id_bitacora}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        ID:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.id_bitacora}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Fecha:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.fecha}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Usuario:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.nombres}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Hora:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.hora}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Nave:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.nombre}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Cámara:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.camara}
                      </span>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Novedad:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.novedad}
                      </span>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Resultado:
                      </span>
                      <span
                        className={`ml-2 text-gray-900 dark:text-white ${
                          bitacora.resultado === 'Resuelto'
                            ? 'text-green-600 dark:text-green-400'
                            : bitacora.resultado === 'Pendiente'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-500'
                        }`}
                      >
                        {bitacora.resultado}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Referencia:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.referencia}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Turno:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.turno}
                      </span>
                    </div>
                    <div className="flex justify-end md:col-span-2 lg:col-span-1">
                      <div className="flex gap-2">
                        <IconButton
                          onClick={() => handleEdit(bitacora)}
                          color="edit"
                          ariaLabel="Editar"
                        >
                          <Edit2 size={18} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(bitacora.id_bitacora)}
                          color="delete"
                          ariaLabel="Eliminar"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, sortedBitacoras.length)}
                <br />
                de {sortedBitacoras.length} bitácoras | Página {currentPage} de {totalPages}
              </p>

              <nav className="flex items-center gap-2">
  {/* Botón ir a primera página */}
  <button
    onClick={() => paginate(1)}
    disabled={currentPage === 1}
    className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
  >
    <ChevronsLeft size={20} />
  </button>

  {/* Botón ir a página anterior */}
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
  >
    <ChevronLeft size={20} />
  </button>

  {/* Botón ir a página siguiente */}
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
  >
    <ChevronRight size={20} />
  </button>

  {/* Botón ir a última página */}
  <button
    onClick={() => paginate(totalPages)}
    disabled={currentPage === totalPages}
    className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
  >
    <ChevronsRight size={20} />
  </button>

  {/* Input para ir a página específica */}
  <input
    type="number"
    min="1"
    max={totalPages}
    value={goToPage || currentPage}
    onChange={(e) => setGoToPage(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        const pageNumber = parseInt(goToPage)
        if (pageNumber >= 1 && pageNumber <= totalPages) paginate(pageNumber)
      }
    }}
    className="w-12 text-center border rounded-md bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
  />

  {/* Texto "/ totalPages" */}
  <span className="text-sm text-gray-700 dark:text-gray-200">
    / {totalPages}
  </span>
</nav>



            </div>
          </div>
        </div>

        {/* Modal */}
        <ModalBitacoras
          showForm={showForm}
          editMode={editMode}
          formData={formData}
          setShowForm={setShowForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}

export default Bitacoras
