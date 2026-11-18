const previsaoService = require('../services/previsaoService');

const buscarCidades = async (req, res) => {
    const nome = typeof req.query.nome === 'string' ? req.query.nome.trim() : '';
    if (!nome || nome.length < 2) {
        return res.status(400).json({ erro: 'Informe pelo menos 2 caracteres para buscar a cidade' });
    }

    try {
        const cidades = await previsaoService.buscarCidades(nome);
        return res.status(200).json(cidades);
    } catch (error) {
        console.error('Erro ao buscar cidades na Open-Meteo:', error);
        return res.status(error.statusCode || 500).json({ erro: 'Não foi possível buscar cidades na Open-Meteo' });
    }
};

const consultarPrevisao = async (req, res) => {
    const cidade = req.body?.cidade;
    const latitude = Number(cidade?.latitude);
    const longitude = Number(cidade?.longitude);

    if (
        !cidade?.nome ||
        !cidade?.pais ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        return res.status(400).json({ erro: 'Selecione uma cidade válida antes de consultar a previsão' });
    }

    try {
        const previsao = await previsaoService.consultarESalvarPrevisao({
            usuarioId: req.usuario.id,
            cidade: { ...cidade, latitude, longitude },
        });
        return res.status(201).json(previsao);
    } catch (error) {
        console.error('Erro ao consultar ou salvar previsão do tempo:', error);
        const status = error.statusCode || 500;
        return res.status(status).json({
            erro: status === 502
                ? 'Não foi possível obter a previsão na Open-Meteo'
                : 'Não foi possível salvar a previsão no banco de dados',
        });
    }
};

const buscarHistorico = async (req, res) => {
    try {
        const previsoes = await previsaoService.buscarHistorico(req.usuario.id);
        return res.status(200).json(previsoes);
    } catch (error) {
        console.error('Erro ao buscar histórico de previsões:', error);
        return res.status(500).json({ erro: 'Não foi possível carregar o histórico de previsões' });
    }
};

module.exports = { buscarCidades, consultarPrevisao, buscarHistorico };
