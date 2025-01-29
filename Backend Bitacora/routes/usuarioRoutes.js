const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

router.post('/usuario_add', authenticateToken.authenticateToken, (req, res) => {
    const { cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso, cargo } = req.body;

    const query = 'INSERT INTO usuario ( cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso, cargo) VALUES (?,?,?,?,?,?,?,?,?,?)';
    connection.query(query, [cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso,cargo], (err, result) => {
        if (err) {
            console.log('Error al insertar datos:', err);
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        } else {
            res.json({ message: 'Bitácora agregada correctamente' });
        }
    });
});
router.post('/usuario_modificar', authenticateToken.authenticateToken, (req, res) => {
    const { cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso, cargo, id_usuario } = req.body;

    const query = 'UPDATE usuario SET cedula = ?, usuario = ?, contrasenia = ?, nombres = ?, direccion = ?, telefono = ?, estado = ?, id_rol_per = ?, ultimo_uso = ?, cargo = ? WHERE id_usuario = ?';
    connection.query(query, [cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso, cargo, id_usuario], (err, result) => {
        if (err) {
            console.log('Error al actualizar datos:', err);
            res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
        } else {
            res.json({ message: 'Bitácora actualizada correctamente' });
        }
    });
});
router.delete('/usuario_eliminar/:id_usuario', authenticateToken.authenticateToken, (req, res) => {
    const id_usuario = req.params.id_usuario;

    const query = 'DELETE FROM usuario WHERE id_usuario = ?';
    connection.query(query, [id_usuario], (err, result) => {
        if (err) {
            console.log('Error al eliminar usuario:', err);
            res.status(500).json({ error: 'Error al eliminar usuario en la base de datos' });
        } else {
            res.json({ message: 'Usuario eliminada correctamente' });
        }
    });
});
router.get('/usuario', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT * FROM usuario';
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