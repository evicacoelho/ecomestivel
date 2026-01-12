import { PerfilUsuario } from '@prisma/client';

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
    perfil: PerfilUsuario;
    avatarUrl: string | null;
    dataCadastro: Date;
    reputacao: number;
  };
  token: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  avatarUrl: string | null;
  dataCadastro: Date;
  reputacao: number;
  totalPlantas: number;
  totalComentarios: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  perfil: PerfilUsuario;
}