const PrevisaoTempo = require('../models/PrevisaoTempo');

const buscarJsonOpenMeteo = async (url, recurso) => {
    let resposta;
    try {
        resposta = await fetch(url);
    } catch (cause) {
        const error = new Error(`Falha de comunicação com a Open-Meteo (${recurso})`, { cause });
        error.statusCode = 502;
        throw error;
    }

    if (!resposta.ok) {
        const error = new Error(`Open-Meteo ${recurso} respondeu com HTTP ${resposta.status}`);
        error.statusCode = 502;
        throw error;
    }

    try {
        return await resposta.json();
    } catch (cause) {
        const error = new Error(`Resposta inválida da Open-Meteo (${recurso})`, { cause });
        error.statusCode = 502;
        throw error;
    }
};

const buscarCidades = async (nome) => {
    const parametros = new URLSearchParams({
        name: nome,
        count: '5',
        language: 'pt',
        format: 'json',
    });
    const dados = await buscarJsonOpenMeteo(
        `https://geocoding-api.open-meteo.com/v1/search?${parametros}`,
        'geocoding'
    );
    return (dados.results || []).map((cidade) => ({
        id: cidade.id,
        nome: cidade.name,
        regiao: cidade.admin1 || '',
        pais: cidade.country || '',
        latitude: cidade.latitude,
        longitude: cidade.longitude,
        timezone: cidade.timezone,
    }));
};

const consultarESalvarPrevisao = async ({ usuarioId, cidade }) => {
    const parametros = new URLSearchParams({
        latitude: String(cidade.latitude),
        longitude: String(cidade.longitude),
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'is_day',
            'precipitation',
            'weather_code',
            'wind_speed_10m',
        ].join(','),
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_probability_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: '7',
    });
    const dados = await buscarJsonOpenMeteo(
        `https://api.open-meteo.com/v1/forecast?${parametros}`,
        'forecast'
    );
    if (!dados.current || !dados.daily) {
        const error = new Error('Open-Meteo retornou uma previsão incompleta');
        error.statusCode = 502;
        throw error;
    }

    const previsao = await PrevisaoTempo.create({
        usuarioId,
        cidade: cidade.nome,
        regiao: cidade.regiao || null,
        pais: cidade.pais,
        latitude: cidade.latitude,
        longitude: cidade.longitude,
        timezone: dados.timezone || cidade.timezone,
        dados,
        consultadoEm: new Date(),
    });

    return previsao;
};

const buscarHistorico = async (usuarioId) => PrevisaoTempo.findAll({
    where: { usuarioId },
    order: [['consultadoEm', 'DESC']],
    limit: 20,
});

module.exports = { buscarCidades, consultarESalvarPrevisao, buscarHistorico };
