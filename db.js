const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    insecureAuth: true
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      setTimeout(handleDisconnect, 2000); // Intenta reconectar después de 2 segundos
    } else {
      console.log('Conexión a la base de datos exitosa!');
    }
  });

  connection.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
      handleDisconnect(); // Reconectar en caso de pérdida de conexión o conexión rechazada
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
