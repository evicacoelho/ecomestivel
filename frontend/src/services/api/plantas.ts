import apiClient from './client';

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
  categorias: string[];
  localizacoes: Array<{
    id: string;
    latitude: number;
    longitude: number;
    endereco?: string;
    descricao?: string;
  }>;
  usuarioRegistro: {
    id: string;
    nome: string;
  };
  dataRegistro: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  avaliacaoMedia: number;
  totalRegistros: number;
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

export const plantaApi = {
  // buscar plantas
  buscar: async (filtros: FiltroPlantas = {}) => {
    const response = await apiClient.get<{
      data: Planta[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/plantas', { params: filtros });
    return response.data;
  },

  // obter planta por ID
  obterPorId: async (id: string) => {
    const response = await apiClient.get<Planta>(`/plantas/${id}`);
    return response.data;
  },

  // cadastrar nova planta
  cadastrar: async (dados: FormData) => {
    const response = await apiClient.post<Planta>('/plantas', dados, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // atualizar planta
  atualizar: async (id: string, dados: Partial<Planta>) => {
    const response = await apiClient.put<Planta>(`/plantas/${id}`, dados);
    return response.data;
  },

  // deletar planta
  deletar: async (id: string) => {
    const response = await apiClient.delete(`/plantas/${id}`);
    return response.data;
  },

  // avaliar planta
  avaliar: async (id: string, avaliacao: number, comentario?: string) => {
    const response = await apiClient.post(`/plantas/${id}/avaliar`, {
      avaliacao,
      comentario,
    });
    return response.data;
  },

  // plantas próximas
  buscarProximas: async (latitude: number, longitude: number, raioKm = 5) => {
    const response = await apiClient.get<Planta[]>('/plantas/proximas', {
      params: { latitude, longitude, raioKm },
    });
    return response.data;
  },
};