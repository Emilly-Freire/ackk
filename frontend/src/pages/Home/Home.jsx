import { useEffect, useState } from 'react';
import { buscarCidades, buscarHistoricoPrevisoes, consultarPrevisao } from '../../services/previsaoService';

const descricaoClima = (codigo) => {
  if (codigo === 0) return 'Céu limpo';
  if ([1, 2, 3].includes(codigo)) return 'Parcialmente nublado';
  if ([45, 48].includes(codigo)) return 'Neblina';
  if ([51, 53, 55, 56, 57].includes(codigo)) return 'Garoa';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return 'Chuva';
  if ([71, 73, 75, 77, 85, 86].includes(codigo)) return 'Neve';
  if ([95, 96, 99].includes(codigo)) return 'Trovoadas';
  return 'Condição não identificada';
};

const estilos = {
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginTop: '1rem',
  },
  button: {
    padding: '0.65rem 1rem',
    border: 0,
    borderRadius: '8px',
    background: 'var(--primary-color)',
    color: '#fff',
    cursor: 'pointer',
  },
  muted: { color: 'var(--text-secondary)' },
};

function Home() {
  const [nomeCidade, setNomeCidade] = useState('');
  const [cidades, setCidades] = useState([]);
  const [previsao, setPrevisao] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [buscandoCidades, setBuscandoCidades] = useState(false);
  const [consultandoPrevisao, setConsultandoPrevisao] = useState(false);
  const [erro, setErro] = useState('');

  const carregarHistorico = async () => {
    try {
      setHistorico(await buscarHistoricoPrevisoes());
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível carregar o histórico.');
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const handleBuscarCidades = async (event) => {
    event.preventDefault();
    setErro('');
    setCidades([]);
    setPrevisao(null);

    if (nomeCidade.trim().length < 2) {
      setErro('Digite pelo menos 2 caracteres para buscar uma cidade.');
      return;
    }

    setBuscandoCidades(true);
    try {
      setCidades(await buscarCidades(nomeCidade.trim()));
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível buscar cidades.');
    } finally {
      setBuscandoCidades(false);
    }
  };

  const handleConsultarPrevisao = async (cidade) => {
    setErro('');
    setConsultandoPrevisao(true);
    try {
      const salva = await consultarPrevisao(cidade);
      setPrevisao(salva);
      await carregarHistorico();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível consultar a previsão.');
    } finally {
      setConsultandoPrevisao(false);
    }
  };

  const dadosPrevisao = previsao?.dados;

  return (
    <div className="page-container">
      <h1>Bem-vindo ao Sistema</h1>
      <section style={estilos.card}>
        <h2>Previsão do tempo</h2>
        <p style={estilos.muted}>Pesquise uma cidade para consultar e salvar a previsão dos próximos 7 dias.</p>
        <p style={estilos.muted}>
          Dados meteorológicos: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>.
        </p>

        <form onSubmit={handleBuscarCidades} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="search"
            value={nomeCidade}
            onChange={(event) => setNomeCidade(event.target.value)}
            placeholder="Ex.: São Paulo"
            aria-label="Nome da cidade"
            minLength={2}
            required
          />
          <button type="submit" style={estilos.button} disabled={buscandoCidades}>
            {buscandoCidades ? 'Buscando...' : 'Buscar cidade'}
          </button>
        </form>

        {erro && <p role="alert" style={{ color: '#d32f2f' }}>{erro}</p>}

        {cidades.length > 0 && (
          <div aria-label="Resultados da busca">
            <h3>Selecione uma cidade</h3>
            {cidades.map((cidade) => (
              <div
                key={`${cidade.id}-${cidade.latitude}-${cidade.longitude}`}
                style={{ ...estilos.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
              >
                <span>{[cidade.nome, cidade.regiao, cidade.pais].filter(Boolean).join(', ')}</span>
                <button
                  type="button"
                  style={estilos.button}
                  disabled={consultandoPrevisao}
                  onClick={() => handleConsultarPrevisao(cidade)}
                >
                  {consultandoPrevisao ? 'Consultando...' : 'Ver previsão'}
                </button>
              </div>
            ))}
          </div>
        )}

        {cidades.length === 0 && nomeCidade.trim().length >= 2 && !buscandoCidades && !erro && (
          <p style={estilos.muted}>Nenhuma cidade encontrada.</p>
        )}

        {dadosPrevisao && (
          <div style={estilos.card}>
            <h3>{[previsao.cidade, previsao.regiao, previsao.pais].filter(Boolean).join(', ')}</h3>
            <p>
              Agora: {dadosPrevisao.current.temperature_2m} {dadosPrevisao.current_units.temperature_2m}
              {' — '}{descricaoClima(dadosPrevisao.current.weather_code)}
            </p>
            <p>
              Sensação: {dadosPrevisao.current.apparent_temperature} {dadosPrevisao.current_units.apparent_temperature}
              {' · '}Umidade: {dadosPrevisao.current.relative_humidity_2m}%
              {' · '}Vento: {dadosPrevisao.current.wind_speed_10m} {dadosPrevisao.current_units.wind_speed_10m}
            </p>

            <h4>Próximos dias</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {dadosPrevisao.daily.time.map((dia, index) => (
                <div key={dia} style={estilos.card}>
                  <strong>{new Date(`${dia}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</strong>
                  <div>{descricaoClima(dadosPrevisao.daily.weather_code[index])}</div>
                  <div>
                    {dadosPrevisao.daily.temperature_2m_min[index]}° / {dadosPrevisao.daily.temperature_2m_max[index]}°
                  </div>
                  <div style={estilos.muted}>
                    Chuva: {dadosPrevisao.daily.precipitation_probability_max[index] ?? '—'}%
                  </div>
                </div>
              ))}
            </div>
            <p style={estilos.muted}>Consulta salva em {new Date(previsao.consultadoEm).toLocaleString('pt-BR')}.</p>
          </div>
        )}
      </section>

      <section style={estilos.card}>
        <h2>Histórico de consultas</h2>
        {historico.length === 0 ? (
          <p style={estilos.muted}>Nenhuma previsão salva ainda.</p>
        ) : (
          <ul>
            {historico.map((item) => (
              <li key={item.id}>
                {[item.cidade, item.regiao, item.pais].filter(Boolean).join(', ')}
                {' — '}{item.dados.current.temperature_2m} {item.dados.current_units.temperature_2m}
                {' — '}{new Date(item.consultadoEm).toLocaleString('pt-BR')}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;