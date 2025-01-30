const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');  // Importar el paquete CORS
const authRouter = require('./routes/authRoutes');
const bitacoraRouter = require('./routes/bitacoraRoutes');
const usuariosRouter = require('./routes/usuariosRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend en el puerto 5173
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeceras permitidas
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/auth', authRouter);
app.use('/bitacoras', bitacoraRouter);
app.use('/usuarios', usuariosRouter);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
