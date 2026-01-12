import { StatusRegistro, TipoCategoria } from '@prisma/client';

export interface Planta {
  id: string;
  nomePopular: string;
  nomeCientifico: string | null;
  descricao: string;
  comestivel: boolean;
  medicinal: boolean;
  nativa: boolean;
  usos: string | null;
  cuidados: string | null;
  imagemUrl: string | null;
  categorias: Categoria[];
  localizacoes: Localizacao[];
  usuarioRegistro: {
    id: string;
    nome: string;
  };
  dataRegistro: Date;
  status: StatusRegistro;
  avaliacaoMedia: number;
  totalRegistros: number;
  totalAvaliacoes: number;
}

export interface Localizacao {
  id: string;
  latitude: number;
  longitude: number;
  endereco: string | null;
  descricao: string | null;
  regiao: string | null;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: TipoCategoria;
}

export interface Comentario {
  id: string;
  usuario: {
    id: string;
    nome: string;
    avatarUrl: string | null;
  };
  texto: string;
  data: Date;
  avaliacao: number | null;
  editado: boolean;
}

export interface FiltroPlantas {
  search?: string;
  categoria?: string[];
  comestivel?: boolean;
  medicinal?: boolean;
  nativa?: boolean;
  latitude?: number;
  longitude?: number;
  raioKm?: number;
  page?: number;
  limit?: number;
}

export interface CreatePlantaRequest {
  nomePopular: string;
  nomeCientifico?: string;
  descricao: string;
  categoria: string[];
  comestivel?: boolean;
  medicinal?: boolean;
  nativa?: boolean;
  usos?: string;
  cuidados?: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  descricaoLocal?: string;
  regiao?: string;
  observacoes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}