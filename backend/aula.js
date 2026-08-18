const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/mensagem', (req, res) => {
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
});

app.listen(3001);