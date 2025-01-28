const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../db'); // Importa tu conexión a la base de datos

// Función para verificar el token de acceso
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    const secretKey = 'MERCADOMAYORISTA_API_KEY_2023_TIC';
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      req.user = user;
      next();
    });
  }

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT id_usuario, cedula, usuario, nombres, direccion, telefono, estado, id_rol_per, cargo FROM usuario WHERE usuario = ? AND contrasenia = ? AND estado = "A"';
    connection.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Error al obtener datos:', err);
        res.status(500).json({ error: 'Error al obtener datos' });
      } else {
        if (result.length === 1) {
          // Las credenciales son válidas, genera el token y envíalo en la respuesta junto con los datos del usuario
          const payload = { username }; // Puedes agregar más información al payload si lo necesitas
          const secretKey = 'MERCADOMAYORISTA_API_KEY_2023_TIC'; // Reemplaza esto por una clave secreta segura en producción
          const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // El token expirará en 1 hora
  
          const userData = {
            id_usuario: result[0].id_usuario,
            cedula: result[0].cedula,
            usuario: result[0].usuario,
            nombres: result[0].nombres,
            direccion: result[0].direccion,
            telefono: result[0].telefono,
            estado: result[0].estado,
            id_rol_per: result[0].id_rol_per,
            cargo : result[0].cargo,
          };
  
          res.json({ token, userData });
        } else {
          res.status(401).json({ error: 'Credenciales incorrectas' });
        }
      }
    });
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;