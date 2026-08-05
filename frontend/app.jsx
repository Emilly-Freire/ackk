const { useEffect, useState } = React;

function App() {
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        fetch('http://localhost:3001/api/mensagem')
            .then(resposta => resposta.json())
            .then(dados => setMensagem(dados.texto))
            .catch(erro => console.error("Erro no fetch:", erro));
    }, []);

    return (
        <div>
            <h1>O servidor diz: {mensagem}</h1>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);