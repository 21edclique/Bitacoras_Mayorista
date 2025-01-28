const express = require('express');
const router = express.Router();
const connection = require('../db'); // Importa tu conexión a la base de datos
const authenticateToken = require('./authRoutes'); // Importa la función de autenticación

router.post('/cebolla_add', authenticateToken.authenticateToken, async (req, res) => {
    const { id_puesto, id_usuario_per, cantidad, fecha, hora, id_comerciante_per } = req.body;

    try {
        // Realizar la inserción en la tabla 'ingreso'
        const queryIngreso = 'INSERT INTO ingreso (id_puesto_per, id_usuario_per, cantidad, fecha, hora) VALUES (?,?,?,?,?)';
        await new Promise((resolve, reject) => {
            connection.query(queryIngreso, [id_puesto, id_usuario_per, cantidad, fecha, hora], (err, result) => {
                if (err) {
                    reject('Error al insertar datos en la base de datos: ' + err);
                } else {
                    resolve();
                }
            });
        });

        // Obtener la cantidad anterior del comerciante
        const querySelect = 'SELECT cupo_semana FROM comerciante WHERE id_comerciante = ?';
        const rows = await new Promise((resolve, reject) => {
            connection.query(querySelect, [id_comerciante_per], (err, rows) => {
                if (err) {
                    reject('Error al obtener la cantidad anterior');
                } else {
                    resolve(rows);
                }
            });
        });

        if (rows.length === 1) {
            const cantidadAnterior = rows[0].cupo_semana;
            const cantidadTotal = parseInt(cantidadAnterior, 10) + parseInt(cantidad, 10);

            // Actualizar la columna 'cupo_semana' en la tabla 'comerciante'
            const queryUpdateComerciante = 'UPDATE comerciante SET cupo_semana = ? WHERE id_comerciante = ?';
            await new Promise((resolve, reject) => {
                connection.query(queryUpdateComerciante, [cantidadTotal, id_comerciante_per], (err, result) => {
                    if (err) {
                        reject('Error al actualizar Comerciante');
                    } else {
                        resolve();
                    }
                });
            });

            // Actualizar la columna 'cupo_semana' en la tabla 'puesto' para el mismo comerciante
            const queryUpdatePuesto = 'UPDATE puesto SET cupo_semana = ? WHERE id_comerciante_per = ?';
            await new Promise((resolve, reject) => {
                connection.query(queryUpdatePuesto, [cantidadTotal, id_comerciante_per], (err, result) => {
                    if (err) {
                        reject('Error al actualizar Puesto');
                    } else {
                        resolve();
                    }
                });
            });

            // Enviar una respuesta una vez que todas las operaciones se hayan completado con éxito
            res.json({ message: 'Ingreso agregada correctamente' });
        } else {
            res.status(404).json({ error: 'Comerciante no encontrado' });
        }
    } catch (error) {
        // Manejar los errores aquí y enviar una respuesta de error
        console.error(error);
        res.status(500).json({ error });
    }
});


router.post('/cebolla_modificar', authenticateToken.authenticateToken, (req, res) => {
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

router.get('/puesto', authenticateToken.authenticateToken, (req, res) => {
    const query = `
        SELECT 
            p.id_puesto, p.nombre AS nombre_puesto, p.cupo, p.id_nave_per, p.id_comerciante_per, p.cupo_semana,
            n.nombre AS nombre_nave,
            c.nombres AS nombre_comerciante, c.cedula,
            pr.nombre AS nombre_producto
        FROM puesto p
        LEFT JOIN nave n ON p.id_nave_per = n.id_nave
        LEFT JOIN comerciante c ON p.id_comerciante_per = c.id_comerciante
        LEFT JOIN producto pr ON c.id_producto_per = pr.id_producto
        WHERE c.activo = "A";
    `;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});
router.get('/ingreso', authenticateToken.authenticateToken, (req, res) => {
    const query = `
        SELECT
            i.id_ingreso,
            i.cantidad,
            i.fecha,
            i.hora,
            p.nombre AS nombre_producto,
            u.nombres AS nombres_usuario,
            u.cargo,
            u.cedula AS cedula_usuario,
            po.nombre AS nombre_puesto,
            po.cupo_semana,
            n.nombre AS nombre_nave,
            c.nombres AS nombres_comerciante,
            c.cedula AS cedula_comerciante
        FROM
            ingreso i
        JOIN
            puesto po ON i.id_puesto_per = po.id_puesto
        JOIN
            usuario u ON i.id_usuario_per = u.id_usuario
        JOIN
            nave n ON po.id_nave_per = n.id_nave
        JOIN
            comerciante c ON po.id_comerciante_per = c.id_comerciante
        JOIN
            producto p ON c.id_producto_per = p.id_producto;
    `;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener datos' });
        } else {
            res.json(result);
        }
    });
});


module.exports = router;
