import apiClient, { setAuthToken } from './client';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
  avatarUrl?: string;
  dataCadastro: string;
  reputacao: number;
}

export interface UserProfile extends AuthUser {
  totalPlantas: number;
  totalComentarios: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthResponse {
  user: {
    id: string;
    nome: string;
    email: string;
    perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
    avatarUrl?: string;
    dataCadastro: string;
    reputacao: number;
  };
  token: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
  avatarUrl?: string;
  dataCadastro: string;
  reputacao: number;
  totalPlantas: number;
  totalComentarios: number;
}

export const authApi = {
  // login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const { token, user } = response.data;
    setAuthToken(token);
    return response.data;
  },

  // registro
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    const { token, user } = response.data;
    setAuthToken(token);
    return response.data;
  },

  // perfil do usuário
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/auth/profile');
    return response.data;
  },

  // atualizar perfil
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/auth/profile', data);
    return response.data;
  },

  // esqueci a senha
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // redefinir senha
  resetPassword: async (token: string, novaSenha: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, novaSenha });
  },

  // logout
  logout: (): void => {
    setAuthToken(null);
  },

  // verificar token
  verifyToken: async (): Promise<{ valid: boolean; user?: UserProfile }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { valid: false };
    }

    try {
      const user = await authApi.getProfile();
      return {
        valid: true,
        user,
      };
    } catch (error) {
      setAuthToken(null);
      return { valid: false };
    }
  },
}