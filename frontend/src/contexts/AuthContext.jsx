import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem('usuario');
        return salvo ? JSON.parse(salvo) : null;
    });

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const entrar = async (email, senha) => {
        setCarregando(true);
        setErro('');

        try {
            const dados = await authService.login(email, senha);
            setUsuario(dados.usuario);
            authService.salvarSessao(dados.token, dados.usuario);
            return true;
        } catch (e) {
            setErro('Email ou senha inválidos');
            return false;
        } finally {
            setCarregando(false);
        }
    };

    const sair = () => {
        authService.limparSessao();
        setUsuario(null);
    };

    const entrarComGoogle = async (credential) => {
        setCarregando(true);
        setErro('');

        try {
            const dados = await authService.loginGoogle(credential);
            authService.salvarSessao(dados.token, dados.usuario);
            setUsuario(dados.usuario);
            return true;
        } catch (err) {
            setErro('Não foi possível entrar com o Google');
            return false;
        } finally {
            setCarregando(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{ usuario, entrar, entrarComGoogle, sair, carregando, erro }}
        >
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
