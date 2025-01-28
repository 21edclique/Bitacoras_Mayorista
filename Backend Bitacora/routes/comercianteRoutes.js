const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

router.post('/comerciante_add', authenticateToken.authenticateToken, (req, res) => {
    const { nombres, cupo, cedula, ciu_comerciante, id_producto_per, cupo_semana, activo } = req.body;

    const query = 'INSERT INTO comerciante ( nombres, cupo, cedula, ciu_comerciante, id_producto_per, cupo_semana, activo) VALUES (?,?,?,?,?,?,?)';
    connection.query(query, [nombres, cupo, cedula, ciu_comerciante, id_producto_per, cupo_semana, activo], (err, result) => {
        if (err) {
            console.log('Error al insertar datos:', err);
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        } else {
            res.json({ message: 'Comerciante agregado correctamente' });
        }
    });
});
router.post('/comerciante_modificar', authenticateToken.authenticateToken, (req, res) => {
    const { id_comerciante, nombres, cupo, cedula,  ciu_comerciante, id_producto_per, cupo_semana, activo } = req.body;

    const query = 'UPDATE comerciante SET nombres = ?, cupo = ?, cedula = ?, ciu_comerciante = ?, id_producto_per = ?, cupo_semana = ?, activo = ? WHERE id_comerciante = ?';
    connection.query(query, [nombres, cupo, cedula,  ciu_comerciante, id_producto_per, cupo_semana, activo, id_comerciante], (err, result) => {
        if (err) {
            console.log('Error al actualizar datos:', err);
            res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
        } else {
            res.json({ message: 'Comerciante actualizado correctamente' });
        }
    });
});

router.get('/comerciante', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT * FROM comerciante';
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;