import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type ModalUsuarioProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editMode: boolean;
  formData: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldsToDisplay: { [key: string]: string };
};

const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
  </label>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
             px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
             focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
));

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => (
  <select
    {...props}
    ref={ref}
    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
             px-3 py-2 text-gray-900 dark:text-gray-100
             focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
));

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

  const handleInputPhoneCedula = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxLength: number,
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= maxLength) {
      handleInputChange({
        target: { name: e.target.name, value },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />

        <div className="inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(fieldsToDisplay).map(([key, label]) => (
                  <InputWrapper key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    {key === 'id_rol_per' ? (
                      <Select
                        id={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione un rol</option>
                        <option value="1">Admin</option>
                        <option value="2">Operador</option>
                        <option value="3">Gerencia</option>
                      </Select>
                    ) : key === 'estado' ? (
                      <Select
                        id={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione un estado</option>
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                      </Select>
                    ) : key === 'cedula' || key === 'telefono' ? (
                      <Input
                        type="text"
                        id={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={(e) => handleInputPhoneCedula(e, 10)}
                        maxLength={10}
                        placeholder={`Ingrese ${label.toLowerCase()}`}
                        required
                      />
                    ) : key === 'contrasenia' ? (
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          id={key}
                          name={key}
                          value={formData[key] || ''}
                          onChange={handleInputChange}
                          placeholder="Ingrese contraseña"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <X size={20} /> : <X size={20} />}
                        </button>
                      </div>
                    ) : (
                      <Input
                        type="text"
                        id={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        placeholder={`Ingrese ${label.toLowerCase()}`}
                        required
                      />
                    )}
                  </InputWrapper>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 
                           dark:hover:bg-blue-700 transition-colors duration-200"
                >
                  {editMode ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUsuario;