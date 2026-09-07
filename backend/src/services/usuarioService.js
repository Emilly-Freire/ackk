const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll();
};

const obterUsuarioPorId = async (id) => {
    return await Usuario.findByPk(id);
};

const criarUsuario = async (data) => {
    return await Usuario.create(data);
};

const atualizarUsuario = async (id, data) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return null;
    }
    return await usuario.update(data);
};

const deletarUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return null;
    }
    await usuario.destroy();
    return usuario;
};

module.exports = { obterTodosUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, deletarUsuario };