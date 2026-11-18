const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @openapi
 * /auth/login:
 *  post:
 *      summary: Faz login e devolve o token JWT
 *      tags: [Autenticacao]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: [email, senha]
 *                      properties:
 *                          email: { type: string, example: admin@email.com }
 *                          senha: { type: string, example: "123456" }
 *          responses:
 *              200: { description: "Login ok, copie data.token e use no botão Authorize" }
 *              401: { description: Email ou senha invalidos }
 */
router.post('/auth/google', authController.loginGoogle);
router.post('/auth/login', authController.login);

module.exports = router;