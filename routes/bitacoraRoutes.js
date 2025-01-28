const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

router.post('/bitacora_add', authenticateToken.authenticateToken, (req, res) => {
    const { fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno } = req.body;

    const query = 'INSERT INTO bitacora (fecha, id_usuario_per,hora,id_nave_per,camara,novedad,resultado,referencia,turno) VALUES (?,?,?,?,?,?,?,?,?)';
    connection.query(query, [fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        } else {
            res.json({ message: 'Bitácora agregada correctamente' });
        }
    });
});

router.post('/bitacora_modificar', authenticateToken.authenticateToken, (req, res) => {
    const { id_nave_per, camara, novedad, resultado, referencia, turno, id_bitacora } = req.body;

    const query = 'UPDATE bitacora SET id_nave_per = ?, camara = ?, novedad = ?, resultado = ?, referencia = ?, turno = ? WHERE id_bitacora = ?';
    connection.query(query, [id_nave_per, camara, novedad, resultado, referencia, turno, id_bitacora], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
        } else {
            res.json({ message: 'Bitácora actualizada correctamente' });
        }
    });
});
router.delete('/bitacora_eliminar/:id_bitacora', authenticateToken.authenticateToken, (req, res) => {
    const id_bitacora = req.params.id_bitacora;

    const query = 'DELETE FROM bitacora WHERE id_bitacora = ?';
    connection.query(query, [id_bitacora], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar bitácora en la base de datos' });
        } else {
            res.json({ message: 'Bitácora eliminada correctamente' });
        }
    });
});

router.get('/bitacora', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT b.id_bitacora, b.fecha, u.nombres, b.hora, CASE WHEN n.id_nave ' +
      'IS NOT NULL THEN n.nombre ELSE NULL END AS nombre, b.camara, b.novedad, b.resultado, ' +
      'b.referencia, b.turno, b.id_nave_per FROM bitacora b INNER JOIN usuario u ON b.id_usuario_per = u.id_usuario ' +
      'LEFT JOIN nave n ON n.id_nave = b.id_nave_per;';
    connection.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos' });
      } else {
        res.json(result);
      }
    });
  });


module.exports = router;
