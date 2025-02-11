import React, { useState } from 'react'
import { useUsuarios } from '../hooks/useUsuarios'
import ModalUsuario from '../Mod/ModalUsuario'
import {
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
const Usuarios = () => {
  const {
    usuarios,
    loading,
    error,
    currentPage,
    itemsPerPage,
    showModal,
    formData,
    editMode,
    handleInputChange,
    handleAddUsuario,
    handleSubmit,
    handleDelete,
    handleEdit,
    openModal,
    paginate,
    setShowModal,
  } = useUsuarios()

  const [goToPage, setGoToPage] = useState('')

  // Ordenar los usuarios por ID descendente (del más reciente al más antiguo)
  const sortedUsuarios = [...usuarios].sort((a, b) => b.id_usuario - a.id_usuario)
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage)
  const currentItems = sortedUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <main className="ml-10 mt-10 p-10 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
            <button
              onClick={() => {
                handleAddUsuario()
                openModal()
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Agregar Usuario</span>
            </button>
          </div>

          {/* Contenido */}
          <div className="grid gap-1">
            {currentItems.map((usuario) => (
              <div
                key={usuario.id_usuario}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">ID:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.id_usuario}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Cédula:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.cedula}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Nombres:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.nombres}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Usuario:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.usuario}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Dirección:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.direccion}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Teléfono:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.telefono}
                    </span>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Estado:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.estado}
                    </span>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Rol:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.id_rol_per}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      Cargo:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {usuario.cargo}
                    </span>
                  </div>

                  <div className="flex justify-end md:col-span-2 lg:col-span-1">
                    <div className="flex gap-2">
                      <IconButton
                        onClick={() => handleEdit(usuario)}
                        color="edit"
                        ariaLabel="Editar"
                      >
                        <Edit2 size={18} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(usuario.id_usuario)}
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
              {Math.min(currentPage * itemsPerPage, sortedUsuarios.length)}
              <br />
              de {sortedUsuarios.length} usuarios | Página {currentPage} de {totalPages}
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
      <ModalUsuario
        fieldsToDisplay={{
          cedula: 'Cédula',
          nombres: 'Nombres Completos',
          usuario: 'Nombre de Usuario',
          contrasenia: 'Contraseña',
          direccion: 'Dirección',
          telefono: 'Teléfono',
          estado: 'Estado',
          id_rol_per: 'Rol de Usuario',
          cargo: 'Cargo',
        }}
        showModal={showModal}
        setShowModal={setShowModal}
        editMode={editMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </main>
  )
}

export default Usuarios
