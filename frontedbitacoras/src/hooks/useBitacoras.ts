import { useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { TypebitacoraT } from "../types";

export default function useBitacora() {
  const [loading, setLoading] = useState(false);
  const [bitacoras, setBitacoras] = useState<TypebitacoraT[]>([]);

  // Obtener todas las bitácoras
  const fetchBitacoras = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}bitacora`, {
        method: "GET",
        headers: {
          Authorization: token || "",
        },
      });
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const data = await response.json();
  
      if (response.ok) {
        setBitacoras(data); // Actualiza el estado
        return data; // Devuelve los datos
      } else {
        throw new Error(data.error || "Error al obtener las bitácoras");
      }
    } catch (error) {
      console.error("Error al obtener bitácoras:", error);
      toast.error(verifyError(error));
      return null; // Devuelve null en caso de error
    } finally {
      setLoading(false);
    }
  };
  
  // Agregar una nueva bitácora
  const addBitacora = async (bitacora: Omit<TypebitacoraT, "id_bitacora">) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}bitacora_add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bitacora),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Bitácora agregada correctamente!");
        fetchBitacoras(); // Actualizar la lista
      } else {
        throw new Error(data.error || "Error al agregar la bitácora");
      }
    } catch (error) {
      console.error("Error al agregar bitácora:", error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };

  // Modificar una bitácora existente
  const modifyBitacora = async (id: string, updatedData: Partial<TypebitacoraT>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}bitacora_modificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id_bitacora: id, ...updatedData }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Bitácora modificada correctamente!");
        fetchBitacoras(); // Actualizar la lista
      } else {
        throw new Error(data.error || "Error al modificar la bitácora");
      }
    } catch (error) {
      console.error("Error al modificar bitácora:", error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una bitácora
  const deleteBitacora = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bitacora_eliminar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Bitácora eliminada correctamente!");
        fetchBitacoras(); // Actualizar la lista
      } else {
        throw new Error(data.error || "Error al eliminar la bitácora");
      }
    } catch (error) {
      console.error("Error al eliminar bitácora:", error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };



  return {
    loading,
    bitacoras,
    fetchBitacoras,
    addBitacora,
    modifyBitacora,
    deleteBitacora,
  };
}
