import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa' // Asegúrate de tener react-icons instalado

type ModalUsuarioProps = {
  showModal: boolean
  setShowModal: (show: boolean) => void
  editMode: boolean
  formData: { [key: string]: string }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  fieldsToDisplay: { [key: string]: string } // Propiedad que especifica qué campos y nombres mostrar
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({
  showModal,
  setShowModal,
  editMode,
  formData,
  handleInputChange,
  handleSubmit,
  fieldsToDisplay, // Recibimos los campos a mostrar y sus nombres
}) => {
  const [showPassword, setShowPassword] = useState(false) // Estado para mostrar/ocultar contraseña

  if (!showModal) return null // En lugar de retornar false, simplemente retornamos null

  const handleInputPhoneCedula = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxLength: number,
  ) => {
    // Permitimos solo números en el campo de teléfono o cédula
    const value = e.target.value.replace(/\D/g, '') // Reemplazamos cualquier cosa que no sea número
    if (value.length <= maxLength) {
      handleInputChange({
        target: { name: e.target.name, value },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {editMode ? 'Editar Usuario' : 'Agregar Usuario'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(fieldsToDisplay).map((key) => (
              <div key={key} className="relative">
                <label className="text-sm font-semibold">{fieldsToDisplay[key]}</label>
                {key === 'id_rol_per' || key === 'estado' ? (
                  <select
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    required
                  >
                    {key === 'id_rol_per' ? (
                      <>
                        <option value="1">Admin</option>
                        <option value="2">Operador</option>
                        <option value="3">Gerencia</option>
                      </>
                    ) : (
                      <>
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                      </>
                    )}
                  </select>
                ) : key === 'cedula' || key === 'telefono' ? (
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={(e) => handleInputPhoneCedula(e, 10)}
                    className="border p-2 rounded w-full"
                    maxLength={10}
                    placeholder={`Ingrese su ${key === 'cedula' ? 'Cédula' : 'Teléfono'}`}
                    required
                  />
                ) : key === 'contrasenia' ? (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full"
                      placeholder="Contraseña"
                      required
                    />


<div
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
  role="button" // Indicates that this div acts as a button
  tabIndex={-1} // Makes the div non-focusable
  onKeyDown={(e) => {
    // Allow keyboard interaction (e.g., pressing Enter or Space)
    if (e.key === 'Enter' || e.key === ' ') {
      setShowPassword(!showPassword);
    }
  }}
  style={{ outline: 'none' }} // Ensure no outline is shown
>
  {showPassword ? (
    <FaEyeSlash className="text-gray-500" size={20} />
  ) : (
    <FaEye className="text-gray-500" size={20} />
  )}
</div>
                   <br />
                  </div>
                ) : (
                  <input
                    type={key === 'contrasenia' ? 'password' : 'text'}
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    required
                  />
                )}
              </div>
            ))}
            
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalUsuario
