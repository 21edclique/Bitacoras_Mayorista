const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const app = express();
const port = 5001;

// Configuración del servidor y la base de datos
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: '192.168.10.46',
  user: 'root',
  password: '',
  database: 'gestionbitacora',
  insecureAuth: true
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa!');
});

// Función para verificar el token de acceso
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  const secretKey = process.env.SECRET_KEY;

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

// login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT id_usuario, cedula, usuario, nombres, direccion, telefono, estado, id_rol_per FROM usuario WHERE usuario = ? AND contrasenia = ?';
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      res.status(500).json({ error: 'Error al obtener datos' });
    } else {
      if (result.length === 1) {
        // Las credenciales son válidas, genera el token y envíalo en la respuesta junto con los datos del usuario
        const payload = { username }; // Puedes agregar más información al payload si lo necesitas
        const secretKey = process.env.SECRET_KEY; // Reemplaza esto por una clave secreta segura en producción
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // El token expirará en 1 hora

        const userData = {
          id_usuario: result[0].id_usuario,
          cedula: result[0].cedula,
          usuario: result[0].usuario,
          nombres: result[0].nombres,
          direccion: result[0].direccion,
          telefono: result[0].telefono,
          estado: result[0].estado,
          id_rol_per: result[0].id_rol_per
        };

        res.json({ token, userData });
      } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    }
  });
});


//bitacoras
app.post('/api/bitacora_add', authenticateToken, (req, res) => {
  const { fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno } = req.body;

  const query = 'INSERT INTO bitacora (fecha, id_usuario_per,hora,id_nave_per,camara,novedad,resultado,referencia,turno) VALUES (?,?,?,?,?,?,?,?,?)';
  connection.query(query, [fecha, id_usuario_per, hora, id_nave_per, camara, novedad, resultado, referencia, turno], (err, result) => {
    if (err) {
      console.log('Error al insertar datos:', err);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    } else {
      res.json({ message: 'Bitácora agregada correctamente' });
    }
  });
});
app.post('/api/bitacora_modificar', authenticateToken, (req, res) => {
  const { id_nave_per, camara, novedad, resultado, referencia, turno, id_bitacora } = req.body;

  const query = 'UPDATE bitacora SET id_nave_per = ?, camara = ?, novedad = ?, resultado = ?, referencia = ?, turno = ? WHERE id_bitacora = ?';
  connection.query(query, [id_nave_per, camara, novedad, resultado, referencia, turno, id_bitacora], (err, result) => {
    if (err) {
      console.log('Error al actualizar datos:', err);
      res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
    } else {
      res.json({ message: 'Bitácora actualizada correctamente' });
    }
  });
});
app.delete('/api/bitacora_eliminar/:id_bitacora', authenticateToken, (req, res) => {
  const id_bitacora = req.params.id_bitacora;

  const query = 'DELETE FROM bitacora WHERE id_bitacora = ?';
  connection.query(query, [id_bitacora], (err, result) => {
    if (err) {
      console.log('Error al eliminar bitácora:', err);
      res.status(500).json({ error: 'Error al eliminar bitácora en la base de datos' });
    } else {
      res.json({ message: 'Bitácora eliminada correctamente' });
    }
  });
});
app.get('/api/bitacora', authenticateToken, (req, res) => {
  const query = 'SELECT b.id_bitacora, b.fecha, u.nombres, b.hora, CASE WHEN n.id_nave ' +
    'IS NOT NULL THEN n.nombre ELSE NULL END AS nombre, b.camara, b.novedad, b.resultado, ' +
    'b.referencia, b.turno, b.id_nave_per FROM bitacora b INNER JOIN usuario u ON b.id_usuario_per = u.id_usuario ' +
    'LEFT JOIN nave n ON n.id_nave = b.id_nave_per;';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      res.status(500).json({ error: 'Error al obtener datos' });
    } else {
      res.json(result);
    }
  });
});


//usuario
app.post('/api/usuario_add', authenticateToken, (req, res) => {
  const { cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso } = req.body;

  const query = 'INSERT INTO usuario ( cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso) VALUES (?,?,?,?,?,?,?,?,?)';
  connection.query(query, [cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso], (err, result) => {
    if (err) {
      console.log('Error al insertar datos:', err);
      res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    } else {
      res.json({ message: 'Bitácora agregada correctamente' });
    }
  });
});
app.post('/api/usuario_modificar', authenticateToken, (req, res) => {
  const { cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso, id_usuario } = req.body;

  const query = 'UPDATE usuario SET cedula = ?, usuario = ?, contrasenia = ?, nombres = ?, direccion = ?, telefono = ?, estado = ?, id_rol_per = ?, ultimo_uso = ? WHERE id_usuario = ?';
  connection.query(query, [cedula, usuario, contrasenia, nombres, direccion, telefono, estado, id_rol_per, ultimo_uso, id_usuario], (err, result) => {
    if (err) {
      console.log('Error al actualizar datos:', err);
      res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
    } else {
      res.json({ message: 'Bitácora actualizada correctamente' });
    }
  });
});
app.delete('/api/usuario_eliminar/:id_usuario', authenticateToken, (req, res) => {
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
app.get('/api/usuario', authenticateToken, (req, res) => {
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




//implementaciones pequeñas
app.post('/api/boton_uso', authenticateToken, (req, res) => {
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
app.get('/api/nave', authenticateToken, (req, res) => {
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
app.get('/api/rol', authenticateToken, (req, res) => {
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
app.get('/api/camara', authenticateToken, (req, res) => {
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

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://192.168.10.115:${port}`);
});
