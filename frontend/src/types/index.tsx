export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
  avatarUrl?: string;
  dataCadastro: string;
  reputacao: number;
}

export interface Planta {
  id: string;
  nomePopular: string;
  nomeCientifico?: string;
  descricao: string;
  comestivel: boolean;
  medicinal: boolean;
  nativa: boolean;
  usos?: string;
  cuidados?: string;
  imagemUrl?: string;
  categorias: Categoria[];
  localizacoes: Localizacao[];
  usuarioRegistro: User;
  dataRegistro: string;
  status: StatusRegistro;
  avaliacaoMedia: number;
  totalRegistros: number;
  totalAvaliacoes: number;
}

export interface Localizacao {
  id: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  descricao?: string;
  regiao?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  tipo: TipoCategoria;
}

export interface Comentario {
  id: string;
  usuario: User;
  texto: string;
  data: string;
  avaliacao?: number;
  editado: boolean;
}

export type StatusRegistro = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'EM_ANALISE';
export type TipoCategoria = 'COMESTIVEL' | 'MEDICINAL' | 'NATIVA' | 'EXOTICA' | 'URBANA' | 'ORNAMENTAL';
export type PerfilUsuario = 'USUARIO' | 'MODERADOR' | 'ADMIN' | 'VISITANTE';