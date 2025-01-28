const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

//implementaciones pequeñas
router.post('/boton_uso', authenticateToken.authenticateToken, (req, res) => {
    const { id_usuario } = req.body;

    const query = 'SELECT * FROM usuario WHERE id_usuario = ?';
    connection.query(query, [id_usuario], (err, result) => {
        if (err) {
            console.log('Error al encontrar datos:', err);
            res.status(500).json({ error: 'Error al encontrar datos en la base de datos' });
        } else {
            if (result && result.length > 0) { // Verificar si hay resultados y si hay al menos un elemento
                const lastButtonUsageDate = result[0].ultimo_uso;
                const today = new Date().setHours(0, 0, 0, 0);

                if (lastButtonUsageDate && lastButtonUsageDate.getTime() === today) {
                    return res.json({ canUseButton: false });
                }

                const queryActualizar = "UPDATE usuario SET ultimo_uso = ? WHERE id_usuario = ?"
                connection.query(queryActualizar, [new Date(), result[0].id_usuario], (err, result) => {
                    if (err) {
                        console.log('Error al actualizar datos:', err);
                        res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
                    } else {
                        res.json({ canUseButton: true });
                    }
                });
            } else {
                res.json({ canUseButton: false }); // No se encontraron resultados, el botón no puede usarse
            }
        }
    });
});
router.get('/nave', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT * FROM nave';
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});
router.get('/rol', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT * FROM rol';
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});
router.get('/producto', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT * FROM producto';
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});
router.get('/camara', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT * FROM camara';
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});
router.get('/dirigido', authenticateToken.authenticateToken, (req, res) => {
    const query = 'SELECT id_usuario, nombres, cargo, id_rol_per, cedula FROM usuario';
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