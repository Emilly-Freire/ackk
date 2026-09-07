import { useState, useEffect } from 'react';
import { getUsuarios, getUsuario, updateUsuario, deleteUsuario } from '../../services/usuarioService';

function Usuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [idBusca, setIdBusca] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const dados = await getUsuarios();
                setUsers(dados.data || []);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.err || err.message || 'Erro ao buscar usuários');
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    const handleBuscarPorId = async () => {
        const usuario = await getUsuario(idBusca);
        setUsers([usuario]);
    };

    const handleEdit = async (user) => {
        const newName = prompt('Digite o novo nome do usuário:', user.nome);
        const newEmail = prompt('Digite o novo email do usuário:', user.email);
        
        if (newName || newEmail) {
            try {
                const updatedUser = await updateUsuario(user.id, { nome: newName, email: newEmail });
                setUsers(users.map(u => u.id === user.id ? updatedUser : u));
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.err || err.message || 'Erro ao atualizar usuário');
            }
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir este usuário?');
        if (!confirmDelete) return;

        try {
            await deleteUsuario(id);
            setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.err || err.message || 'Erro ao deletar usuário');
        }
    };

    return(
        <div className="page-container">
            <h1>Lista de Usuarios</h1>
            
            {loading && <div style={styles.message}>Carregando usuários...</div>}

            {error && <div style={styles.message}>Ops! {error}</div>}

            {!loading && !error && users.length === 0 && (
                <div style={styles.message}>Nenhum usuário encontrado no momento.</div>
            )}

            {!loading && !error && users.length > 0 && (
                <ul style={styles.userList}>
                    {users.map(user => (
                        <li key={user.id} style={styles.userCard}>
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{user.nome}</span>
                                <span style={styles.userEmail}>{user.email}</span>
                            </div>

                            <div style={styles.statusBadge}>
                                ID #{user.id}
                            </div>
                            <div style={styles.userActions}>
                                <button style={styles.editButton} onClick={() => handleEdit(user)}>Editar</button>
                                <button style={styles.deleteButton} onClick={() => handleDelete(user.id)}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    userList: {
        listStyleType: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
    },
    userCard: {
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBotton: '4px',
    },
    userEmail: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
    },
    statusBadge: {
        background: 'var(--badge-bg)',
        color: 'var(--primary-color)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    message: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        margin: '2rem 0',
        fontSize: '1.2rem',
    },
    userActions: {
        display: 'flex',
        gap: '8px',
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
}

export default Usuarios;