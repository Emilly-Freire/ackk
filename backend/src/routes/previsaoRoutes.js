const express = require('express');
const previsaoController = require('../controllers/previsaoController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/cidades', autenticar, previsaoController.buscarCidades);
router.post('/previsoes', autenticar, previsaoController.consultarPrevisao);
router.get('/historico', autenticar, previsaoController.buscarHistorico);

module.exports = router;
