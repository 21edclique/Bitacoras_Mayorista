import React, { useEffect, useState } from 'react';
import { useBitacoras } from '../hooks/useBitacoras';
import useNave from '../hooks/useNave';
import useCamara from '../hooks/useCamara';
import { X } from 'lucide-react';

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

type Camara = {
  id_camara: number;
  nombre: string;
  id_nave_per: number;
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
             focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500
             disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
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

const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
  <textarea
    {...props}
    ref={ref}
    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
             px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
             focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500
             min-h-[100px]"
  />
));

const ModalBitacoras: React.FC<ModalBitacorasProps> = ({
  showForm,
  editMode,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmit
}) => {
  const { naveData, loading, error } = useNave();
  const { camaraData } = useCamara();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toISOString().split('T')[0]);
    setCurrentTime(now.toTimeString().split(' ')[0].substring(0, 5));
  }, []);

  if (!showForm) return null;
  if (loading) return <div className="text-center dark:text-white">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />

        <div className="inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Editar Bitácora' : 'Nueva Bitácora'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={currentDate}
                    onChange={handleInputChange}
                    readOnly
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    type="time"
                    id="hora"
                    name="hora"
                    value={currentTime}
                    onChange={handleInputChange}
                    readOnly
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="usuario">Usuario</Label>
                  <Input
                    type="text"
                    id="usuario"
                    name="id_usuario_per"
                    value={localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') || '{}').nombres : ''}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="nave">Nave</Label>
                  <Select
                    id="nave"
                    name="id_nave_per"
                    value={formData.id_nave_per}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una nave</option>
                    {naveData.map((nave: Nave) => (
                      <option key={nave.id_nave} value={nave.id_nave}>{nave.nombre}</option>
                    ))}
                  </Select>
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="camara">Cámara</Label>
                  <Select
                    id="camara"
                    name="id_nave_per"
                    value={formData.id_nave_per}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una Cámara</option>
                    {camaraData.map((camara: Camara) => (
                      <option key={camara.id_camara} value={camara.id_camara}>{camara.nombre}</option>
                    ))}
                  </Select>
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="turno">Turno</Label>
                  <Select
                    id="turno"
                    name="turno"
                    value={formData.turno}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="turno1">Turno 1</option>
                    <option value="turno2">Turno 2</option>
                    <option value="turno3">Turno 3</option>
                  </Select>
                </InputWrapper>
              </div>

              <InputWrapper>
                <Label htmlFor="novedad">Novedad</Label>
                <TextArea
                  id="novedad"
                  name="novedad"
                  placeholder="Ingrese la novedad"
                  value={formData.novedad}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper>
                  <Label htmlFor="resultado">Resultado</Label>
                  <Select
                    id="resultado"
                    name="resultado"
                    value={formData.resultado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un resultado</option>
                    <option value="res1">Resuelto</option>
                    <option value="res2">No resuelto</option>
                    <option value="res3">Pendiente</option>
                  </Select>
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="referencia">Referencia</Label>
                  <Input
                    type="text"
                    id="referencia"
                    name="referencia"
                    placeholder="Ingrese la referencia"
                    value={formData.referencia}
                    onChange={handleInputChange}
                  />
                </InputWrapper>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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

export default ModalBitacoras;