import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RotaPrivada({ children, perfilNecessario }) {
    const { usuario } = useAuth();

    if(!usuario) {
        return <Navigate to="/login" replace />;
    }

    if(perfilNecessario && usuario.perfil !== perfilNecessario) {
        return <Navigate to="/sem-permissao" replace />;
    }

    return children;
}

export default RotaPrivada;