import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'

type ModalUsuarioProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editMode: boolean;
  formData: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldsToDisplay: { [key: string]: string };
};

const ModalUsuario: React.FC<ModalUsuarioProps> = ({
  showModal,
  setShowModal,
  editMode,
  formData,
  handleInputChange,
  handleSubmit,
  fieldsToDisplay,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(fieldsToDisplay).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>

              {key === 'id_rol_per' ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Seleccione un rol</option>
                  <option value="1">Admin</option>
                  <option value="2">Operador</option>
                  <option value="3">Gerencia</option>
                </select>
              ) : key === 'estado' ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Seleccione un estado</option>
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </select>
              ) : key === 'contrasenia' ? (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id={key}
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleInputChange}
                    placeholder="Ingrese contraseña"
                    required={!editMode} // Solo es obligatorio al crear un usuario
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEye/> : <FaEyeSlash/>}
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {editMode ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;
