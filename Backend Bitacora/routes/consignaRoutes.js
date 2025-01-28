const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

router.get('/consigna', authenticateToken.authenticateToken, (req, res) => {
    const query = `SELECT c.id_consigna, c.fecha, c.dirigido, c.id_usuario_per, u.nombres AS origen, u.cargo, c.consigna_especial, 
                   c.estado, c.omv, c.fecha_verificacion, c.hora_verificacion
                   FROM consigna c
                   INNER JOIN usuario u ON c.id_usuario_per = u.id_usuario;`;

    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});

router.post('/consigna_modificar', authenticateToken.authenticateToken, (req, res) => {
    const { fecha, dirigido, id_usuario_per, consigna_especial, estado, omv, fecha_verificacion, hora_verificacion, id_consigna } = req.body;

    const query = 'UPDATE consigna SET fecha = ?, dirigido = ?, id_usuario_per = ?, consigna_especial = ?, estado = ?, omv = ?, fecha_verificacion= ?, hora_verificacion = ? WHERE id_consigna = ?';
    connection.query(query, [fecha, dirigido, id_usuario_per, consigna_especial, estado, omv, fecha_verificacion, hora_verificacion, id_consigna], (err, result) => {
        if (err) {
            console.log('Error al actualizar datos:', err);
            res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
        } else {
            res.json({ message: 'Consigna actualizada correctamente' });
        }
    });
});
router.post('/consigna_modificar_operador', authenticateToken.authenticateToken, (req, res) => {
    const { estado, omv, fecha_verificacion, hora_verificacion, id_consigna } = req.body;

    const query = 'UPDATE consigna SET estado = ?, omv = ?, fecha_verificacion= ?, hora_verificacion = ? WHERE id_consigna = ?';
    connection.query(query, [estado, omv, fecha_verificacion, hora_verificacion, id_consigna], (err, result) => {
        if (err) {
            console.log('Error al actualizar datos:', err);
            res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
        } else {
            res.json({ message: 'Consigna actualizada correctamente' });
        }
    });
});

router.delete('/consigna_eliminar/:id_consigna', authenticateToken.authenticateToken, (req, res) => {
    const id_consigna = req.params.id_consigna;

    const query = 'DELETE FROM consigna WHERE id_consigna = ?';
    connection.query(query, [id_consigna], (err, result) => {
        if (err) {
            console.log('Error al eliminar consigna:', err);
            res.status(500).json({ error: 'Error al eliminar consigna en la base de datos' });
        } else {
            res.json({ message: 'Consigna eliminada correctamente' });
        }
    });
});
router.post('/consigna_add', authenticateToken.authenticateToken, (req, res) => {
    const { fecha, dirigido, id_usuario_per, consigna_especial } = req.body;

    const query = 'INSERT INTO consigna (fecha, dirigido, id_usuario_per, consigna_especial) VALUES (?,?,?,?)';
    connection.query(query, [fecha, dirigido, id_usuario_per, consigna_especial], (err, result) => {
        if (err) {
            console.log('Error al insertar datos:', err);
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        } else {
            res.json({ message: 'Consigna agregada correctamente' });
        }
    });
});

module.exports = router;