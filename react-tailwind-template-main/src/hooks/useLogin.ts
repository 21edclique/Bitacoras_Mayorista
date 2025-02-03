// src/hooks/useLogin.ts
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // Agregar showPassword


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  // Limpiar cualquier error anterior

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      const { token, userData } = response.data;
      
      localStorage.setItem('token', token);  // Guardar el token en localStorage
      return { token, userData };  // Retornar los datos para ser utilizados en el componente

    } catch (err) {
      setError('Credenciales incorrectas');
      return null;  // Retorna null si hay un error
    }
  };

  return {
    username,
    password,
    error,
    setUsername,
    setPassword,
    handleSubmit,
    showPassword,
    setShowPassword,
  };
};

export default useLogin;
