import React, { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import ModalUsuario from '../Mod/ModalUsuario';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

  const [confirmAction, setConfirmAction] = useState<null | 'delete'>(null);
  const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const confirmDelete = () => {
    if (usuarioToDelete !== null) {
      handleDelete(usuarioToDelete);
      setUsuarioToDelete(null);
      setConfirmAction(null);
    }
  };

  return (
    <main className="ml-10 mt-24 p-6 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
            <button
              onClick={() => {
                handleAddUsuario();
                openModal();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Agregar Usuario</span>
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="table-fixed w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Cédula</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Nombres</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Dirección</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Cargo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((usuario) => (
                  <tr key={usuario.id_usuario} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm">{usuario.id_usuario}</td>
                    <td className="px-4 py-3 text-sm">{usuario.cedula}</td>
                    <td className="px-4 py-3 text-sm">{usuario.nombres}</td>
                    <td className="px-4 py-3 text-sm">{usuario.usuario}</td>
                    <td className="px-4 py-3 text-sm">{usuario.direccion}</td>
                    <td className="px-4 py-3 text-sm">{usuario.telefono}</td>
                    <td className="px-4 py-3 text-sm">{usuario.estado}</td>
                    <td className="px-4 py-3 text-sm">{usuario.id_rol_per}</td>
                    <td className="px-4 py-3 text-sm">{usuario.cargo}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { handleEdit(usuario); openModal(); }} className="text-yellow-600 px-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => { setConfirmAction('delete'); setUsuarioToDelete(usuario.id_usuario); }} className="text-red-600 px-2">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirmación de eliminación */}
          {confirmAction === 'delete' && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-center dark:text-white">¿Estás seguro de que deseas eliminar este usuario?</h3>
                <div className="flex justify-center space-x-4 mt-4">
                  <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                    Confirmar
                  </button>
                  <button onClick={() => setConfirmAction(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Usuarios;
