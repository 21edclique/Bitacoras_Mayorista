import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import Swal from "sweetalert2"

export const useBitacoras = () => {
  const [bitacoras, setBitacoras] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  const [currentBitacora, setCurrentBitacora] = useState<any>(null);

  const initialFormState = {
    fecha: '',
    id_usuario_per: '',
    hora: '',
    id_nave_per: '',
    id_camara: '', 
    camara: '',
    novedad: '',
    resultado: '',
    referencia: '',
    turno: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBitacoras();
  }, []);

  const fetchBitacoras = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/log/bitacora`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBitacoras(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las bitácoras');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });


  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isDarkMode = document.documentElement.classList.contains("dark");
  
    try {
      if (editMode && currentBitacora) {
        await axios.post(
          `${API_URL}/log/bitacora_modificar`,
          { ...formData, id_bitacora: currentBitacora.id_bitacora },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${API_URL}/log/bitacora_add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      setFormData(initialFormState);
      setShowForm(false);
      setEditMode(false);
      fetchBitacoras();
  
      const isDarkModeNow = document.documentElement.classList.contains("dark");
  
      Swal.fire({
        title: "Éxito",
        text: "La bitácora se ha guardado correctamente.",
        icon: "success",
        background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
        color: isDarkModeNow ? "#ffffff" : "#000000",
      });
    } catch (err) {
      const isDarkModeNow = document.documentElement.classList.contains("dark");
  
      setError("Error al guardar la bitácora");
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la bitácora.",
        icon: "error",
        background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
        color: isDarkModeNow ? "#ffffff" : "#000000",
      });
    }
  };
  
  const handleDelete = async (id_bitacora: number) => {
    const token = localStorage.getItem("token");
    const isDarkMode = document.documentElement.classList.contains("dark");
  
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
      cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: isDarkMode ? "#1e1e1e" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/log/bitacora_eliminar/${id_bitacora}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchBitacoras();
  
          const isDarkModeNow = document.documentElement.classList.contains("dark");
  
          Swal.fire({
            title: "Eliminado",
            text: "La bitácora ha sido eliminada.",
            icon: "success",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          setError("Error al eliminar la bitácora");
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
  
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la bitácora.",
            icon: "error",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  };

  const handleEdit = (bitacora: any) => {
    setFormData(bitacora);
    setEditMode(true);
    setShowForm(true);
    setCurrentBitacora(bitacora);
  };

  const handleAddBitacora = () => {
    setFormData(initialFormState); // Limpia los datos al agregar una nueva
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const currentItems = bitacoras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    bitacoras,
    loading,
    error,
    currentPage,
    itemsPerPage,
    showForm,
    editMode,
    currentBitacora,
    formData,
    fetchBitacoras,
    handleInputChange,
    handleAddBitacora,
    handleSubmit,
    handleDelete,
    handleEdit,
    paginate,
    currentItems,
    setShowForm,
  };
};
