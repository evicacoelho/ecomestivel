// src/hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api/auth';
import { type UserProfile } from '../services/api/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;  // ← ADICIONE ESTA LINHA
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, confirmarSenha: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed property para isAuthenticated
  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 Inicializando autenticação...');
      try {
        const token = localStorage.getItem('token');
        console.log('🔍 Token no localStorage:', token ? `SIM (${token.substring(0, 20)}...)` : 'NÃO');
        if (token) {
          console.log('🔄 Verificando token com backend...');
          const { valid, user: userData } = await authApi.verifyToken();
          console.log('✅ Resposta da verificação:', { valid, userData: userData?.email });
          if (valid && userData) {
            console.log('👤 Usuário autenticado:', userData.email);
            setUser(userData);
          } else {
            console.log('❌ Token inválido ou expirado');
            authApi.logout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authApi.logout();
      } finally {
        setLoading(false);
        console.log('🏁 Autenticação inicializada');
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, senha });
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome: string, email: string, senha: string, confirmarSenha: string) => {
    setLoading(true);
    try {
      const response = await authApi.register({ nome, email, senha, confirmarSenha });
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,  // ← ADICIONE ESTA LINHA
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};