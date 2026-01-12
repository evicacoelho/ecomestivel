export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
  avatarUrl?: string;
  dataCadastro: string;
  reputacao: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}