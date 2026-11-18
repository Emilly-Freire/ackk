const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if(!email || !senha) {
            return res.status(400).json({ err: 'Erro, email e senha são obrigatórios...' });
        }

        const usuario = await authService.login(email, senha);
        return res.status(200).json(usuario);
    } catch (error) {
        if(error.message === 'CREDENCIAIS_INVALIDAS') {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        return res.status(500).json({ err: 'Erro interno ao realizar login' });
    }
}

const loginGoogle = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: 'Credential não enviado' });
        }

        const dados = await authService.loginComGoogle(credential);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ err: 'Falha na autenticação com o Google' });
    }
}

module.exports = { login, loginGoogle };
