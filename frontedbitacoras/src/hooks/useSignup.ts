import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { UserSignUpT } from "../types";

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (userData: UserSignUpT) => {
    setLoading(true);
    try {
      // Realizar la solicitud POST al servidor para el login
      const response: Response = await fetch(`${API_BASE_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // Permite el envío de cookies (credenciales)
        body: JSON.stringify(userData),
      });

      // Verificamos la respuesta del servidor
      const data = await response.json();

      console.log("API response:", data);

      if (response.ok) {
        // Almacena el token y los datos del usuario en localStorage
        const { token, userData } = data;
        if (!token || !userData) {
          throw new Error("Datos incompletos en la respuesta del servidor.");
        }

        // Guardamos el token y los datos del usuario en localStorage
        localStorage.setItem("epema-token", token); // Guarda el token
        console.log("Token guardado en localStorage:", token);
        localStorage.setItem("epema-user", JSON.stringify(userData)); // Guarda los datos del usuario

        // Actualizamos el contexto con los datos del usuario
        setAuthUser(userData);
        toast.success("¡Inicio de sesión exitoso!");
      } else {
        // Si la respuesta no es ok, lanzamos un error
        throw new Error(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false); // Restablecemos el estado de carga
    }
  };



  return { loading, login };
}
