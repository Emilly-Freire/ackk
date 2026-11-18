const express = require('express');
const usuarioRoutes = require('./usuarioRoutes.js');
const previsaoRoutes = require('./previsaoRoutes.js');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.use('/usuarios', usuarioRoutes);
router.use('/clima', previsaoRoutes);

module.exports = router;
