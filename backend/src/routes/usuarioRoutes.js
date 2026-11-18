const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

const { autenticar } = require('../middlewares/authMiddleware');

router.post('/', usuarioController.criarUsuarios);

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404: { description: Usuário nao encontrado }
 */

router.get('/', autenticar, usuarioController.buscarUsuarios);
router.get('/:id', autenticar, usuarioController.buscarUsuario);
router.put('/:id', autenticar, usuarioController.atualizarUsuarios);
router.delete('/:id', autenticar, usuarioController.deletarUsuarios);

module.exports = router;
