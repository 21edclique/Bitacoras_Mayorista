import React, { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import ModalUsuario from '../Mod/ModalUsuario';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

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
      className={`
        p-2 rounded-lg
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        ${colorStyles[color]}
      `}
    >
      {children}
    </button>
  );
};

const Usuarios = () => {
  const {
    usuarios,
    loading,
    error,
    currentPage,
    itemsPerPage,
    currentItems,
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
  } = useUsuarios();

  const [confirmAction, setConfirmAction] = useState<null | 'delete' | 'edit'>(null);
  const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null);

  if (loading) return <div className="text-center py-4">Cargando usuarios...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  const totalPages = Math.ceil(usuarios.length / itemsPerPage);
  const getPageRange = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Usuarios</h1>

      <button
        onClick={() => {
          handleAddUsuario();
          openModal();
        }}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                   text-white px-4 py-2 rounded-lg mb-6 flex items-center gap-2 mx-auto 
                   transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        <Plus size={20} />
        Agregar Usuario
      </button>

      <div className="rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {Object.keys(formData).map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  {Object.keys(formData).map((key) => (
                    <td key={key} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                      {usuario[key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <IconButton onClick={() => handleEdit(usuario)} color="edit" ariaLabel="Editar">
                        <Edit2 size={18} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setConfirmAction('delete');
                          setUsuarioToDelete(usuario.id_usuario);
                        }}
                        color="delete"
                        ariaLabel="Eliminar"
                      >
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
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, usuarios.length)} de {usuarios.length} usuarios
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

      <ModalUsuario
        fieldsToDisplay={{
          cedula: 'Cédula',
          nombres: 'Nombres Completos',
          usuario: 'Nombre de Usuario',
          contrasenia: 'Contraseña',
          direccion: 'Dirección',
          telefono: "Teléfono",
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

      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-center dark:text-white">
              ¿Estás seguro de que deseas {confirmAction === 'delete' ? 'eliminar' : 'editar'} este usuario?
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => {
                  if (confirmAction === 'delete' && usuarioToDelete !== null) {
                    handleDelete(usuarioToDelete);
                  } else if (confirmAction === 'edit') {
                    handleEdit(formData);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Confirmar
              </button>
              <button 
                onClick={() => {
                  setConfirmAction(null);
                  setUsuarioToDelete(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;