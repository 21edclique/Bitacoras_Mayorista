import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de configurar esta constante
import useRol from './useRol'; // Importa tu hook de roles

const initialFormState = {
  id_usuario: '',
  cedula: '',
  usuario: '',
  contrasenia: '',
  nombres: '',
  direccion: '',
  telefono: '',
  estado: '',
  id_rol_per: '',  
  cargo: '',
};

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentUsuario, setCurrentUsuario] = useState<any>(null);
  const [formData, setFormData] = useState(initialFormState);

  // Nuevo estado para manejar los campos a mostrar
  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>([
    'usuario', 'nombres', 'cedula', 'telefono', 'estado', 'cargo', 
  ]);

  // Usamos el hook de roles aquí
  const { rolData, loading: loadingRoles, error: errorRoles } = useRol(); 

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/usuario`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {
      if (editMode && currentUsuario) {
        // Solo enviar el id_usuario si estamos en modo de edición
        await axios.post(
          `${API_URL}/users/usuario_modificar`,
          { ...formData, id_usuario: currentUsuario.id_usuario },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Al crear un nuevo usuario no enviar el id_usuario
        await axios.post(`${API_URL}/users/usuario_add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      // Resetear el formulario y cerrar el modal
      setFormData(initialFormState);
      setShowModal(false);
      setEditMode(false);
      fetchUsuarios(); // Volver a obtener los usuarios
    } catch (err) {
      setError('Error al guardar el usuario');
    }
  };

  const handleDelete = async (id_usuario: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/users/usuario_eliminar/${id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsuarios();
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  };

  const handleEdit = (usuario: any) => {
    setFormData({
      ...initialFormState, // Mantiene los valores iniciales
      ...usuario, // Sobrescribe solo los valores existentes
    });
    setEditMode(true);
    setShowModal(true);
    setCurrentUsuario(usuario);
  };
  
  const handleAddUsuario = () => {
    setFormData(initialFormState); // Limpia los datos al agregar una nueva
  };

  const openModal = () => {
    setFormData(initialFormState);
    setEditMode(false);
    setShowModal(true);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    usuarios,
    rolData, // Aquí pasamos los roles a tu componente para usarlos en el combo box
    loading,
    loadingRoles, // Indicador de carga de roles
    error,
    errorRoles, // Error de roles
    currentPage,
    itemsPerPage,
    formData,
    showModal,
    editMode,
    fieldsToDisplay, // Agregamos fieldsToDisplay a los valores retornados
    handleInputChange,
    handleAddUsuario,
    handleSubmit,
    handleDelete,
    handleEdit,
    openModal,
    paginate,
    setShowModal,
    currentItems: usuarios.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ),
  };
};
