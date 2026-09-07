const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json(usuarios);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao buscar usuarios' });
    }
};

const buscarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuarioService.obterUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ err: 'Usuario não encontrado' });
        }
        res.status(200).json(usuario);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao buscar usuario' });
    }
}

const criarUsuario = async (req, res) => {
    const { nome, email } = req.body;
    try {
        const novoUsuario = await usuarioService.criarUsuario({ nome, email });
        res.status(201).json(novoUsuario);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao criar usuario' });
    }
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, { nome, email });
        if (!usuarioAtualizado) {
            return res.status(404).json({ err: 'Usuario não encontrado' });
        }
        res.status(200).json(usuarioAtualizado);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao atualizar usuario' });
    }
};

const deletarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioDeletado = await usuarioService.deletarUsuario(id);
        if (!usuarioDeletado) {
            return res.status(404).json({ err: 'Usuario não encontrado' });
        }
        res.status(200).json({ message: 'Usuario deletado com sucesso' });
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao deletar usuario' });
    }
};

module.exports = {
    buscarUsuarios,
    buscarUsuario,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};

/*app.get('/api/mensagem', (req, res) => {
    res.json({ texto: "Ola do Servidor!" });
});

app.get('/cep/:cep', async (req, res) => {
    const { cep } = req.params;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) return res.status(400).json({ erro: "CEP não encontrado" });

        res.status(200).json(dados);
    } catch(err) {
        res.status(500).json({ erro: "Erro de comunicação com VIACEP" });
    }
});

app.get('/cep/:cep/xml/', async (req, res) => {
    const { cep } = req.params;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/xml/`);
        const dadosXml = await resposta.text();

        if (dadosXml.includes('<xml></xml>') || dadosXml.includes('<enderecos/>')) return res.status(400).json({ erro: "CEP não encontrado" });

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.status(200).send(dadosXml);
    } catch(err) {
        res.status(500).json({ erro: "Erro de comunicação com VIACEP" });
    }
});

app.get('/endereco/:uf/:cidade/:logradouro/json/', async (req, res) => {
    const { uf, cidade, logradouro } = req.params;

    if (!uf || uf.trim().length !== 2) {
        return res.status(400).json({ erro: "A UF deve conter 2 (dois) caracteres" });
    }

    if (!cidade || cidade.trim().length < 3) {
        return res.status(400).json({ erro: "A Cidade deve conter pelo menos 3 (três) caracteres"});
    }

    if(!logradouro || logradouro.trim().length < 3) {
        return res.status(400).json({ erro: "O Logradouro deve conter pelo menos 3 (três) caracteres"});
    }

    try {
        const urlUf = encodeURIComponent(uf.trim());
        const urlCidade = encodeURIComponent(cidade.trim());
        const urlLogradouro = encodeURIComponent(logradouro.trim());

        const resposta = await fetch(`https://viacep.com.br/ws/${urlUf}/${urlCidade}/${urlLogradouro}/json/`);
        const dados = await resposta.json();

        if (!dados || dados.length === 0) return res.status(400).json({ erro: "Endereço não encontrado" });

        res.status(200).json(dados);
    } catch(err) {
        res.status(500).json({ erro: "Erro de comunicação com VIACEP" });
    }
});

app.get('/endereco/:uf/:cidade/:logradouro/xml/', async (req, res) => {
    const { uf, cidade, logradouro } = req.params;

    if (!uf || uf.trim().length !== 2) {
        return res.status(400).json({ erro: "A UF deve conter 2 (dois) caracteres" });
    }

    if (!cidade || cidade.trim().length < 3) {
        return res.status(400).json({ erro: "A Cidade deve conter pelo menos 3 (três) caracteres"});
    }

    if(!logradouro || logradouro.trim().length < 3) {
        return res.status(400).json({ erro: "O Logradouro deve conter pelo menos 3 (três) caracteres"});
    }

    try {
        const urlUf = encodeURIComponent(uf.trim());
        const urlCidade = encodeURIComponent(cidade.trim());
        const urlLogradouro = encodeURIComponent(logradouro.trim());

        const resposta = await fetch(`https://viacep.com.br/ws/${urlUf}/${urlCidade}/${urlLogradouro}/xml/`);
        const dadosXml = await resposta.text();

        if (dadosXml.includes('<xml></xml>') || dadosXml.includes('<enderecos/>')) return res.status(400).json({ erro: "Endereço não encontrado" });

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.status(200).send(dadosXml);
    } catch(err) {
        res.status(500).json({ erro: "Erro de comunicação com VIACEP" });
    }
}); */