const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../db/connection'); // Cambia según la ubicación de tu conexión
const authenticateToken = require('../middlewares/authMiddleware');


router.get('/rol', authenticateToken, (req, res) => {
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



module.exports = router;