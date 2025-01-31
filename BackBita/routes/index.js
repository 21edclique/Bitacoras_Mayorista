const express = require('express');

const authRouter = require('./authRoutes');
const bitacoraRouter = require('./bitacoraRoutes');
const usuariosRouter = require('./usuariosRoutes');
const naveRouter = require('./naveRoutes');
const camaraRouter = require('./camaraRoutes');
const rolRouter = require('./rolRoutes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/log', bitacoraRouter);
router.use('/users', usuariosRouter);
router.use('/ship', naveRouter);
router.use('/camera', camaraRouter);
router.use('/functions', rolRouter);

module.exports = router;
