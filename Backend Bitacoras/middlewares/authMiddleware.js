const jwt = require('jsonwebtoken');

const secretKey = 'MERCADOMAYORISTA_API_KEY_2023_TIC';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // No autorizado
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Prohibido
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
