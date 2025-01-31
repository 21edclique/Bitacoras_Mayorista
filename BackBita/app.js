const express = require('express');
const cookieParser = require('cookie-parser');
const corsConfig = require('./config/corsConfig');
const routes = require('./routes');  // Importamos las rutas unificadas

const app = express();

// Middlewares
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/epema', routes);

module.exports = app;
