import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  registerStart,
  registerSuccess,
  registerFailure,
  updateUser,
  clearError,
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,
} from '../store/slices/authSlice';
import { authApi, setAuthToken } from '../services/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  // login
  const login = useCallback(
    async (email: string, senha: string) => {
      try {
        dispatch(loginStart());
        const response = await authApi.login({ email, senha });
        setAuthToken(response.token);
        dispatch(loginSuccess(response));
        return { success: true, data: response };
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
        dispatch(loginFailure(errorMessage));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  // registro
  const register = useCallback(
    async (nome: string, email: string, senha: string, confirmarSenha: string) => {
      try {
        dispatch(registerStart());
        const response = await authApi.register({ nome, email, senha, confirmarSenha });
        setAuthToken(response.token);
        dispatch(registerSuccess(response));
        return { success: true, data: response };
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao registrar';
        dispatch(registerFailure(errorMessage));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  // logout
  const logout = useCallback(() => {
    authApi.logout();
    dispatch(logoutAction());
  }, [dispatch]);

  // verificar autenticação
  const checkAuth = useCallback(async () => {
    try {
      dispatch(checkAuthStart());
      const result = await authApi.verifyToken();
      
      if (result.valid && result.user) {
        dispatch(checkAuthSuccess(result.user));
      } else {
        dispatch(checkAuthFailure());
      }
    } catch (error) {
      dispatch(checkAuthFailure());
    }
  }, [dispatch]);

  // atualizar dados do usuário
  const updateUserData = useCallback(
    async (userData: Partial<typeof user>) => {
      if (!userData) return;
      
      try {
        const updatedUser = await authApi.updateProfile(userData);
        dispatch(updateUser(updatedUser));
        return { success: true, data: updatedUser };
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil';
        return { success: false, error: errorMessage };
      }
    },
    [dispatch, user]
  );

  // limpar erros
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // MOCK DATA
  const mockLogin = useCallback(() => {
    // ROUTE authApi.verifyToken
    checkAuth();
  }, [checkAuth]);

  return {
    // estado
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // ações
    login,
    register,
    logout,
    checkAuth,
    updateUser: updateUserData,
    clearError: clearAuthError,
    mockLogin,
    
    // utilitários
    isAdmin: user?.perfil === 'ADMIN',
    isModerator: user?.perfil === 'MODERADOR' || user?.perfil === 'ADMIN',
    isUser: user?.perfil === 'USUARIO',
  };
};