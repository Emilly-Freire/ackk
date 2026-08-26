const express = require('express');
const usuarioRoutes = require('./usuarioRoutes.js');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);

module.exports = router;