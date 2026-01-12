import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';

// LAZY
const Home = lazy(() => import('../pages/Home'));
const MapPage = lazy(() => import('../pages/MapPage'));
const Plantas = lazy(() => import('../pages/Plantas'));
const PlantaDetalhes = lazy(() => import('../pages/PlantaDetalhes'));
const RegistrarPlanta = lazy(() => import('../pages/RegistrarPlanta'));
const Login = lazy(() => import('../pages/Login'));
const Cadastro = lazy(() => import('../pages/Cadastro'));
const Perfil = lazy(() => import('../pages/Perfil'));
const MinhasPlantas = lazy(() => import('../pages/MinhasPlantas'));
const Moderacao = lazy(() => import('../pages/Moderacao'));
const NotFound = lazy(() => import('../pages/NotFound'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

// PROTECTED
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.perfil)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="plantas" element={<Plantas />} />
          <Route path="plantas/:id" element={<PlantaDetalhes />} />
          <Route path="buscar" element={<Plantas />} />
          <Route path="login" element={<Login />} />
          <Route path="cadastro" element={<Cadastro />} />
          
          {/* Rotas protegidas */}
          <Route
            path="registrar"
            element={
              <ProtectedRoute>
                <RegistrarPlanta />
              </ProtectedRoute>
            }
          />
          <Route
            path="perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="minhas-plantas"
            element={
              <ProtectedRoute>
                <MinhasPlantas />
              </ProtectedRoute>
            }
          />
          <Route
            path="moderacao"
            element={
              <ProtectedRoute roles={['MODERADOR', 'ADMIN']}>
                <Moderacao />
              </ProtectedRoute>
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;