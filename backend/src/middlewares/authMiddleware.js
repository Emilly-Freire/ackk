const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : req.body?.token;

    if (!token) {
        return res.status(401).json({ error: 'Token nao enviado no body' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalido' });
    }
};

const autorizar = (...perfisPermitidos) => {
    return (req, res, next) => {
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        next();
    };
};

module.exports = { autenticar, autorizar };
