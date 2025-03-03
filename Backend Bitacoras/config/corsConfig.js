const cors = require('cors');

const corsOptions = {
  origin: ['http://192.168.10.138:8080','http://localhost:5173'],  // Ajusta el dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
