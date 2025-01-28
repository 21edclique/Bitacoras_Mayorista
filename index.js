const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

// Configuración del servidor y la base de datos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ... más configuraciones ...

// Importa tus routers
const authRoutes = require('./routes/authRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const otrasRutas = require('./routes/otrasRutas');
const consignaRutas = require('./routes/consignaRoutes');
const cebollaRutas = require('./routes/cebolla');
const comercianteRutas = require('./routes/comercianteRoutes');
const puestoRutas = require('./routes/puestoRoutes');

// ... más imports ...

// Usa los routers
app.use('/api', authRoutes);
app.use('/api', bitacoraRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', otrasRutas);
app.use('/api', consignaRutas);
app.use('/api', cebollaRutas);
app.use('/api', comercianteRutas);
app.use('/api', puestoRutas);
// ... más usos de routers ...

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://192.168.10.198:${port}`);
});
