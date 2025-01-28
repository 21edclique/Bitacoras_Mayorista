const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

router.post('/puesto_add', authenticateToken.authenticateToken, (req, res) => {
    const { nombre, cupo, id_nave_per, id_comerciante_per, cupo_semana } = req.body;
    const id_comerciante_per_null = id_comerciante_per == '' ? null : id_comerciante_per;
    const query = 'INSERT INTO puesto ( nombre, cupo, id_nave_per, id_comerciante_per, cupo_semana) VALUES (?,?,?,?,?)';
    connection.query(query, [nombre, cupo, id_nave_per, id_comerciante_per_null, cupo_semana], (err, result) => {
        if (err) {
            console.log('Error al insertar datos:', err);
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        } else {
            res.json({ message: 'Puesto agregado correctamente' });
        }
    });
});
router.post('/puesto_modificar', authenticateToken.authenticateToken, (req, res) => {
    let { id_puesto, nombre, cupo, id_nave_per, id_comerciante_per, cupo_semana } = req.body;
    id_comerciante_per = id_comerciante_per == '' ? null : id_comerciante_per;
    const query = 'UPDATE puesto SET nombre = ?, cupo = ?, id_nave_per = ?, id_comerciante_per = ?, cupo_semana = ? WHERE id_puesto = ?';
    connection.query(query, [nombre, cupo, id_nave_per, id_comerciante_per, cupo_semana, id_puesto], (err, result) => {
        if (err) {
            console.log('Error al actualizar datos:', err);
            res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
        } else {
            res.json({ message: 'puesto actualizado correctamente' });
        }
    });
});



module.exports = router;