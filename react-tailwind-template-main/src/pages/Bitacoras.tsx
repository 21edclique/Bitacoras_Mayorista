import React from 'react'
import { useBitacoras } from '../hooks/useBitacoras'
import { jsPDF } from 'jspdf'

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

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

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

  if (loading) return <div className="text-center py-4">Cargando bitácoras...</div>
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>

  const totalPages = Math.ceil(bitacoras.length / itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1)
    }
  }

  const getPageRange = () => {
    const range = []
    const maxPagesToShow = 5
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Bitácoras</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">Bitácora</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Usuario</th>
              <th className="border px-4 py-2">Hora</th>
              <th className="border px-4 py-2">Nave</th>
              <th className="border px-4 py-2">Cámara</th>
              <th className="border px-4 py-2">Novedad</th>
              <th className="border px-4 py-2">Resultado</th>
              <th className="border px-4 py-2">Referencia</th>
              <th className="border px-4 py-2">Turno</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((bitacora) => (
              <tr key={bitacora.id_bitacora} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{bitacora.id_bitacora}</td>
                <td className="border px-4 py-2">{bitacora.fecha}</td>
                <td className="border px-4 py-2">{bitacora.nombres}</td>
                <td className="border px-4 py-2">{bitacora.hora}</td>
                <td className="border px-4 py-2">{bitacora.nombre || 'N/A'}</td>
                <td className="border px-4 py-2">{bitacora.camara}</td>
                <td className="border px-4 py-2">{bitacora.novedad}</td>
                <td className="border px-4 py-2">{bitacora.resultado}</td>
                <td className="border px-4 py-2">{bitacora.referencia}</td>
                <td className="border px-4 py-2">{bitacora.turno}</td>
                <td className="border px-4 py-2">
                  <div className="flex space-x-2">
                    <IconButton
                      onClick={() => handleEdit(bitacora)}
                      color="edit"
                      ariaLabel="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(bitacora.id_bitacora)}
                      color="delete"
                      ariaLabel="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => {
          handleAddBitacora() // Restablece el formulario antes de abrirlo
          setShowForm(true)
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-6 flex items-center gap-2 mx-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Agregar Bitácora
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          {/* Add bitacora form here */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
                <h2 className="text-xl font-bold mb-4">
                  {editMode ? 'Editar Bitácora' : 'Agregar Bitácora'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="id_usuario_per"
                      placeholder="ID Usuario"
                      value={formData.id_usuario_per}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="time"
                      name="hora"
                      value={formData.hora}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="id_nave_per"
                      placeholder="ID Nave"
                      value={formData.id_nave_per}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="camara"
                      placeholder="Cámara"
                      value={formData.camara}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                    />
                    <textarea
                      name="novedad"
                      placeholder="Novedad"
                      value={formData.novedad}
                      onChange={handleInputChange}
                      className="border p-5 rounded w-full min-h-[80px] text-lg"
                    />

                    <input
                      type="text"
                      name="resultado"
                      placeholder="Resultado"
                      value={formData.resultado}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      name="referencia"
                      placeholder="Referencia"
                      value={formData.referencia}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      name="turno"
                      placeholder="Turno"
                      value={formData.turno}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {editMode ? 'Actualizar Bitácora' : 'Agregar Bitácora'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      <nav aria-label="Page navigation" className="flex justify-center mt-6">
        <ul className="flex items-center gap-1">
          <li>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <span className="sr-only">Anterior</span>
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </button>
          </li>
          {getPageRange().map((page) => (
            <li key={page}>
              <button
                onClick={() => paginate(page)}
                className={`flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage === page
                    ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                    : ''
                }`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <span className="sr-only">Siguiente</span>
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Bitacoras
