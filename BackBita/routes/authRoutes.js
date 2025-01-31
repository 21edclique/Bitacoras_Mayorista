const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../db/connection'); // Cambia según la ubicación de tu conexión
const authenticateToken = require('../middlewares/authMiddleware');

const secretKey = 'MERCADOMAYORISTA_API_KEY_2023_TIC';

// Ruta para iniciar sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `
    SELECT id_usuario, cedula, usuario, nombres, direccion, telefono, estado, id_rol_per, cargo 
    FROM usuario 
    WHERE usuario = ? AND contrasenia = ? AND estado = "A"
  `;

  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      return res.status(500).json({ error: 'Error al obtener datos' });
    }

    if (result.length === 1) {
      const userData = {
        id_usuario: result[0].id_usuario,
        cedula: result[0].cedula,
        usuario: result[0].usuario,
        nombres: result[0].nombres,
        direccion: result[0].direccion,
        telefono: result[0].telefono,
        estado: result[0].estado,
        id_rol_per: result[0].id_rol_per,
        cargo: result[0].cargo,
      };

      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

      return res.json({ token, userData });
    }

    res.status(401).json({ error: 'Credenciales incorrectas' });
  });
});

// Servicio de logout
const logoutService = async (res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 }); // Limpiar la cookie
    return { status: 200, message: 'Logout exitoso' };
  } catch (error) {
    return { status: 500, message: 'Error al cerrar sesión' };
  }
};

// Ruta para cerrar sesión
router.post('/logout', async (req, res) => {
  const result = await logoutService(res);
  res.status(result.status).json({ message: result.message });
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
