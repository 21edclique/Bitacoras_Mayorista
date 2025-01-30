const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../db/connection'); // Cambia según la ubicación de tu conexión

// Clave secreta
const secretKey = 'MERCADOMAYORISTA_API_KEY_2023_TIC';

// Middleware para verificar el token de acceso
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // No autorizado
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Prohibido
    }
    req.user = user;
    next();
  });
}

// Ruta para agregar bitácora
router.post('/bitacora_add', authenticateToken, (req, res) => {
  const { fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno } = req.body;

  const query = 'INSERT INTO bitacora (fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno) VALUES (?,?,?,?,?,?,?,?,?)';
  connection.query(query, [fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno], (err, result) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
    res.json({ message: 'Bitácora agregada correctamente' });
  });
});

// Ruta para modificar bitácora
router.post('/bitacora_modificar', authenticateToken, (req, res) => {
  const { id_nave_per, camara, novedad, resultado, referencia, turno, id_bitacora } = req.body;

  const query = 'UPDATE bitacora SET id_nave_per = ?, camara = ?, novedad = ?, resultado = ?, referencia = ?, turno = ? WHERE id_bitacora = ?';
  connection.query(query, [id_nave_per, camara, novedad, resultado, referencia, turno, id_bitacora], (err, result) => {
    if (err) {
      console.error('Error al actualizar en la base de datos:', err);
      return res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
    }
    res.json({ message: 'Bitácora actualizada correctamente' });
  });
});

// Ruta para eliminar bitácora
router.delete('/bitacora_eliminar/:id_bitacora', authenticateToken, (req, res) => {
  const id_bitacora = req.params.id_bitacora;

  const query = 'DELETE FROM bitacora WHERE id_bitacora = ?';
  connection.query(query, [id_bitacora], (err, result) => {
    if (err) {
      console.error('Error al eliminar en la base de datos:', err);
      return res.status(500).json({ error: 'Error al eliminar bitácora en la base de datos' });
    }
    res.json({ message: 'Bitácora eliminada correctamente' });
  });
});

// Ruta para obtener todas las bitácoras (con información extraída)
router.get('/bitacora', authenticateToken, (req, res) => {
  const query = 'SELECT b.id_bitacora, b.fecha, u.nombres, b.hora, CASE WHEN n.id_nave IS NOT NULL THEN n.nombre ELSE NULL END AS nombre, b.camara, b.novedad, b.resultado, b.referencia, b.turno, b.id_nave_per FROM bitacora b INNER JOIN usuario u ON b.id_usuario_per = u.id_usuario LEFT JOIN nave n ON n.id_nave = b.id_nave_per;';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(result);
  });
});

// Ruta para obtener todas las bitácoras (sin unión con otras tablas)
router.get('/bita', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM bitacora';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(result);
  });
});

module.exports = router;
