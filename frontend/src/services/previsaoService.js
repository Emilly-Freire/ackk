import api from './api';

export const buscarCidades = async (nome) => {
    const response = await api.get('/clima/cidades', { params: { nome } });
    return response.data;
};

export const consultarPrevisao = async (cidade) => {
    const response = await api.post('/clima/previsoes', { cidade });
    return response.data;
};

export const buscarHistoricoPrevisoes = async () => {
    const response = await api.get('/clima/historico');
    return response.data;
};
