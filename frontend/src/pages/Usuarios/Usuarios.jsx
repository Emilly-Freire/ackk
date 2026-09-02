import { useState, useEffect } from 'react';
import { getUsuarios } from '../../services/usuarioService';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const dados = await getUsuarios();
                console.log(dados);
                setUsuarios(dados.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUsuarios();
    }, []);

    return(
        <div className="page-container">
            <h1>Lista de Usuarios</h1>
            <ul>
                {usuarios.map(user => (
                    <li key={user.id}>
                        <span>{user.nome}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Usuarios;