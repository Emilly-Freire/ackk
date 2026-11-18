const bcrypt = require('bcrypt')
const Usuario = require('../models/Usuario');

const jwt = require('jsonwebtoken');
const  { OAuth2Client } = require('google-auth-library');


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (email, senha) => {
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    if(!usuario) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const confere =  await bcrypt.compare(senha, usuario.senha);

    if(!confere) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome } };
};

const loginComGoogle = async (credential) => {
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, email_verified } = payload;

    if(!email_verified) {
        throw new Error('EMAIL_NAO_VERIFICADO');
    }
    
    let usuario = await Usuario.findOne({ where: { google_id: sub } });

    if(!usuario) {
        usuario = await Usuario.findOne({ where: { email } });

        if(usuario) {
            Usuario.google_id = sub;
            await usuario.save();
        } else {
            usuario = await Usuario.create({
                nome: name,
                email,
                google_id: sub,
                foto: picture,
                perfil: 'aluno',
            });
        }
    }

    if(!usuario.foto && picture) {
        usuario.foto = picture;
        await usuario.save();
    }

    const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome, foto: usuario.foto } };
};

module.exports = { login, loginComGoogle };
