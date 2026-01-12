import apiClient from './client';

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
    return response.data;
  },

  // registro
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
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
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  },

  // verificar token
  verifyToken: async (): Promise<{ valid: boolean; user?: UserProfile }> => {
    // MOCK DATA
    const token = localStorage.getItem('token');
    if (!token) {
      return { valid: false };
    }

    try {
      // MOCK DATA
      return {
        valid: true,
        user: {
          id: '1',
          nome: 'urutau',
          email: 'teste@urutau.com',
          perfil: 'USUARIO',
          dataCadastro: new Date().toISOString(),
          reputacao: 100,
          totalPlantas: 5,
          totalComentarios: 12,
        },
      };
    } catch (error) {
      return { valid: false };
    }
  },
};