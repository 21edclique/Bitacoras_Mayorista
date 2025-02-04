import React, { useEffect, useState } from 'react';

import { useBitacoras } from '../hooks/useBitacoras';
import useNave from '../hooks/useNave';
import useCamara from '../hooks/useCamara';

type ModalBitacorasProps = {
    
  showForm: boolean;
  editMode: boolean;
  formData: {
    fecha: string;
    id_usuario_per: string;
    hora: string;
    id_nave_per: string;
    camara: string;
    novedad: string;
    resultado: string;
    referencia: string;
    turno: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowForm: (show: boolean) => void;
};

type Nave = {
  id_nave: number;
  nombre: string;
  sector: number;
  productos: string;
};

type Camara ={
id_camara: number;
nombre: string;
id_nave_per: number;


}


const ModalBitacoras: React.FC<ModalBitacorasProps> = ({
  showForm,
  editMode,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmit
}) => {
  const { naveData, loading, error } = useNave();  // Obtenemos los datos de naves desde el hook
  const { camaraData } = useCamara();  // Obtenemos los datos de naves desde el hook

  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Establecer la fecha y hora actuales cuando el componente se monta
   
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // Formato yyyy-mm-dd
    const formattedTime = now.toTimeString().split(' ')[0].substring(0, 5); // Formato hh:mm

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4">{editMode ? 'Editar Bitácora' : 'Ingresar Nueva Bitácora'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <label htmlFor="fecha" className="mr-2 text-gray-600">Fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={currentDate}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
                readOnly
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="usuario" className="mr-2 text-gray-600">Usuario:</label>
              <input
                type="text"
                id="usuario"
                name="id_usuario_per"
                value={localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') || '{}').nombres : ''}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
                required
                readOnly // El campo no es editable
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="hora" className="mr-2 text-gray-600">Hora:</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={currentTime}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
                readOnly
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="nave" className="mr-2 text-gray-600">Nave:</label>
              <select
                id="nave"
                name="id_nave_per"
                value={formData.id_nave_per}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
                required
              >
                <option value="">Seleccione una nave</option>
                {naveData.map((nave: Nave) => (
                  <option key={nave.id_nave} value={nave.id_nave}>
                    {nave.nombre} 
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="camara" className="mr-2 text-gray-600">Cámara:</label>
              <select
                id="camara"
                name="id_nave_per"
                value={formData.id_nave_per}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
                required
              >
                <option value="">Seleccione una Cámara</option>
                {camaraData.map((camara: Camara) => (
                  <option key={camara.id_camara} value={camara.id_camara}>
                    {camara.nombre} 
                  </option>
                ))}
              </select>
              
            </div>
            <label htmlFor="novedad" className="text-gray-600">Novedad:</label>
            <textarea
              id="novedad"
              name="novedad"
              placeholder="Ingrese la novedad"
              value={formData.novedad}
              onChange={handleInputChange}
              className="border p-2 rounded text-lg"
            />
            <div className="flex items-center">
              <label htmlFor="resultado" className="mr-2 text-gray-600">Resultado:</label>
              <select
                id="resultado"
                name="resultado"
                value={formData.resultado}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
              >
                <option value="">Seleccione un resultado</option>
                <option value="res1">Resuelto </option>
                <option value="res2">No resuelto </option>
                <option value="res3">Pendiente </option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="referencia" className="mr-2 text-gray-600">Referencia:</label>
              <input
                type="text"
                id="referencia"
                name="referencia"
                placeholder="Referencia"
                value={formData.referencia}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="turno" className="mr-2 text-gray-600">Turno:</label>
              <select
                id="turno"
                name="turno"
                value={formData.turno}
                onChange={handleInputChange}
                className="border p-2 rounded flex-1"
              >
                <option value="">Seleccione un turno</option>
                <option value="turno1">Turno 1</option>
                <option value="turno2">Turno 2</option>
                <option value="turno3">Turno 3</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2 flex items-center gap-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              {editMode ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBitacoras;
