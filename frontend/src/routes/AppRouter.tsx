import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Páginas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Plantas from '../pages/Plantas';
import PlantaDetalhes from '../pages/PlantaDetalhes';
import RegistrarPlanta from '../pages/RegistrarPlanta';
import MinhasPlantas from '../pages/MinhasPlantas';
import Perfil from '../pages/Perfil';
import Moderacao from '../pages/Moderacao';
import MapPage from '../pages/MapPage';
import NotFound from '../pages/NotFound';

// Componente para rotas protegidas
interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPerfil?: ('USUARIO' | 'MODERADOR' | 'ADMIN')[];
}

const PrivateRoute = ({ children, requiredPerfil = ['USUARIO', 'MODERADOR', 'ADMIN'] }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!requiredPerfil.includes(user.perfil)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="plantas" element={<Plantas />} />
        <Route path="plantas/:id" element={<PlantaDetalhes />} />
        <Route path="mapa" element={<MapPage />} />
        
        {/* Rotas protegidas - usuário comum */}
        <Route path="registrar-planta" element={
          <PrivateRoute>
            <RegistrarPlanta />
          </PrivateRoute>
        } />
        
        <Route path="minhas-plantas" element={
          <PrivateRoute>
            <MinhasPlantas />
          </PrivateRoute>
        } />
        
        <Route path="perfil" element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } />
        
        {/* Rotas protegidas - moderadores e admins */}
        <Route path="moderacao" element={
          <PrivateRoute requiredPerfil={['MODERADOR', 'ADMIN']}>
            <Moderacao />
          </PrivateRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;