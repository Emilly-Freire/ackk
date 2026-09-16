const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.buscarUsuarios);
router.get('/:id', usuarioController.buscarUsuario);
router.post('/', usuarioController.criarUsuarios);
router.put('/:id', usuarioController.atualizarUsuarios);
router.delete('/:id', usuarioController.deletarUsuarios);

module.exports = router;