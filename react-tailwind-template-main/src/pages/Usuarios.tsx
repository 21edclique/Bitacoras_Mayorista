import React, { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import ModalUsuario from '../Mod/ModalUsuario'; // Importar el nuevo componente

type IconButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  color?: 'default' | 'edit' | 'delete';
  ariaLabel: string;
};

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
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        p-2 rounded-full 
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        ${colorStyles[color]}
      `}
    >
      {children}
    </button>
  );
};

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
);

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
);

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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const handleConfirmDelete = () => {
    if (usuarioToDelete) {
      handleDelete(usuarioToDelete);
      setConfirmAction(null);
      setUsuarioToDelete(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
    setUsuarioToDelete(null);
  };

  // Verificación de cédula duplicada al agregar un usuario
  const checkCedulaDuplicate = (cedula: string) => {
    return usuarios.some(usuario => usuario.cedula === cedula);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Usuarios</h1>

      <button
        onClick={() => {
          handleAddUsuario(); // Restablece el formulario antes de abrir el modal
          openModal();
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6 flex items-center gap-2 mx-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Agregar Usuario
      </button>

      <ModalUsuario
        fieldsToDisplay={{
          cedula: 'Cédula',
          nombres: 'Nombres Completos',
          usuario: 'Nombre de Usuario',
          contrasenia: 'Contraseña',
          direccion: 'Dirección',
          telefono:"Teléfono",
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

      {/* Mensaje de confirmación para eliminar o editar */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-center">
              ¿Estás seguro de que deseas {confirmAction === 'delete' ? 'eliminar' : 'editar'} este usuario?
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={confirmAction === 'delete' ? handleConfirmDelete : handleEdit}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sí
              </button>
              <button onClick={handleCancelAction} className="bg-gray-500 text-white px-4 py-2 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(formData).map((key) => (
                <th key={key} className="border px-4 py-2">
                  {key.toUpperCase()}
                </th>
              ))}
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((usuario) => (
              <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                {Object.keys(formData).map((key) => (
                  <td key={key} className="border px-4 py-2">
                    {usuario[key]}
                  </td>
                ))}
                <td className="border px-4 py-2">
                  <div className="flex space-x-2">
                    <IconButton
                      onClick={() => handleEdit(usuario)}
                      color="edit"
                      ariaLabel="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setConfirmAction('delete');
                        setUsuarioToDelete(usuario.id_usuario);
                      }}
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

      {/* Paginación mejorada */}
      <nav aria-label="Page navigation" className="flex justify-center mt-6">
        <ul className="flex items-center gap-1">
          <li>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              &laquo;
            </button>
          </li>
          {getPageRange().map((page) => (
            <li key={page}>
              <button
                onClick={() => paginate(page)}
                className={`flex items-center justify-center px-3 h-8 text-sm ${
                  currentPage === page
                    ? 'text-white bg-blue-500'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                } border border-gray-300 rounded-lg`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Usuarios;
