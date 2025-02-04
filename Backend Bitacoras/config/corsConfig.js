const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',  // Ajusta el dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
