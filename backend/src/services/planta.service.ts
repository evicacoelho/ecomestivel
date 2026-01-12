import { PrismaClient, StatusRegistro, TipoCategoria } from '@prisma/client';
import { 
  CreatePlantaRequest, 
  FiltroPlantas, 
  PaginatedResponse,
  Planta 
} from '../types/planta.types';
import { calculateDistance } from '../utils/coordinates';

const prisma = new PrismaClient();

export class PlantaService {
  async buscarPlantas(filtros: FiltroPlantas): Promise<PaginatedResponse<Planta>> {
    const page = filtros.page || 1;
    const limit = filtros.limit || 20;
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Text search
    if (filtros.search) {
      where.OR = [
        { nomePopular: { contains: filtros.search, mode: 'insensitive' } },
        { nomeCientifico: { contains: filtros.search, mode: 'insensitive' } },
        { descricao: { contains: filtros.search, mode: 'insensitive' } },
      ];
    }
    
    // Filters
    if (filtros.comestivel !== undefined) {
      where.comestivel = filtros.comestivel;
    }
    
    if (filtros.medicinal !== undefined) {
      where.medicinal = filtros.medicinal;
    }
    
    if (filtros.nativa !== undefined) {
      where.nativa = filtros.nativa;
    }
    
    // Category filter
    if (filtros.categoria && filtros.categoria.length > 0) {
      where.categorias = {
        some: {
          categoria: {
            nome: { in: filtros.categoria },
          },
        },
      };
    }
    
    // Location filter
    if (filtros.latitude && filtros.longitude && filtros.raioKm) {
      // Get all locations within bounding box first
      const plantasComLocalizacoes = await prisma.planta.findMany({
        where,
        include: {
          registros: {
            include: {
              localizacao: true,
            },
          },
        },
      });
      
      // Filter by distance
      const plantasFiltradas = plantasComLocalizacoes.filter(planta => {
        return planta.registros.some(registro => {
          const distance = calculateDistance(
            filtros.latitude!,
            filtros.longitude!,
            registro.localizacao.latitude,
            registro.localizacao.longitude
          );
          return distance <= filtros.raioKm!;
        });
      });
      
      const total = plantasFiltradas.length;
      const plantasPaginadas = plantasFiltradas.slice(skip, skip + limit);
      
      // Format response
      const data = await Promise.all(
        plantasPaginadas.map(async planta => await this.formatPlanta(planta))
      );
      
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
    
    // Regular pagination (without location filter)
    const [plantas, total] = await Promise.all([
      prisma.planta.findMany({
        where,
        skip,
        take: limit,
        include: {
          categorias: {
            include: {
              categoria: true,
            },
          },
          registros: {
            include: {
              localizacao: true,
              usuario: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
            take: 1,
            orderBy: {
              dataRegistro: 'desc',
            },
          },
        },
        orderBy: {
          nomePopular: 'asc',
        },
      }),
      prisma.planta.count({ where }),
    ]);
    
    const data = await Promise.all(
      plantas.map(async planta => await this.formatPlanta(planta))
    );
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async buscarPlantasProximas(
    latitude: number,
    longitude: number,
    raioKm: number = 5,
    limit: number = 50
  ): Promise<Planta[]> {
    const todasPlantas = await prisma.planta.findMany({
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
        registros: {
          include: {
            localizacao: true,
            usuario: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });
    
    // Calculate distance for each plant
    const plantasComDistancia = todasPlantas.map(planta => {
      const distanciaMinima = Math.min(
        ...planta.registros.map(registro => 
          calculateDistance(
            latitude,
            longitude,
            registro.localizacao.latitude,
            registro.localizacao.longitude
          )
        )
      );
      
      return {
        planta,
        distancia: distanciaMinima,
      };
    });
    
    // Filter by distance and sort
    const plantasFiltradas = plantasComDistancia
      .filter(item => item.distancia <= raioKm)
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, limit)
      .map(item => item.planta);
    
    return Promise.all(
      plantasFiltradas.map(async planta => await this.formatPlanta(planta))
    );
  }
  
  async obterPlantaPorId(id: string): Promise<Planta> {
    const planta = await prisma.planta.findUnique({
      where: { id },
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
        registros: {
          include: {
            localizacao: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                avatarUrl: true,
              },
            },
            imagens: true,
            comentarios: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nome: true,
                    avatarUrl: true,
                  },
                },
              },
              orderBy: {
                data: 'desc',
              },
            },
          },
          orderBy: {
            dataRegistro: 'desc',
          },
        },
        avaliacoes: true,
      },
    });
    
    if (!planta) {
      throw new Error('Planta não encontrada');
    }
    
    return await this.formatPlanta(planta);
  }
  
  async cadastrarPlanta(userId: string, data: CreatePlantaRequest, images?: Express.Multer.File[]): Promise<Planta> {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Create or find categories
      const categorias = await Promise.all(
        data.categoria.map(async (categoriaNome) => {
          let categoria = await tx.categoria.findFirst({
            where: { nome: categoriaNome },
          });
          
          if (!categoria) {
            categoria = await tx.categoria.create({
              data: {
                nome: categoriaNome,
                tipo: categoriaNome as TipoCategoria,
                descricao: `Categoria ${categoriaNome.toLowerCase()}`,
              },
            });
          }
          
          return categoria;
        })
      );
      
      // Create plant
      const planta = await tx.planta.create({
        data: {
          nomePopular: data.nomePopular,
          nomeCientifico: data.nomeCientifico || null,
          descricao: data.descricao,
          comestivel: data.comestivel || false,
          medicinal: data.medicinal || false,
          nativa: data.nativa !== undefined ? data.nativa : true,
          usos: data.usos || null,
          cuidados: data.cuidados || null,
          categorias: {
            create: categorias.map(categoria => ({
              categoriaId: categoria.id,
            })),
          },
        },
      });
      
      // Create location
      const localizacao = await tx.localizacao.create({
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          endereco: data.endereco || null,
          descricao: data.descricaoLocal || null,
          regiao: data.regiao || null,
        },
      });
      
      // Create registration
      const registro = await tx.registroPlanta.create({
        data: {
          usuarioId: userId,
          plantaId: planta.id,
          localizacaoId: localizacao.id,
          observacoes: data.observacoes || null,
          status: StatusRegistro.PENDENTE,
        },
      });
      
      // Upload images if provided
      if (images && images.length > 0) {
        await Promise.all(
          images.map(async (image) => {
            await tx.imagemPlanta.create({
              data: {
                registroId: registro.id,
                url: `/uploads/plantas/${image.filename}`,
                nomeArquivo: image.originalname,
                contentType: image.mimetype,
                tamanho: image.size,
              },
            });
          })
        );
      }
      
      // Get complete plant data
      const plantaCompleta = await tx.planta.findUnique({
        where: { id: planta.id },
        include: {
          categorias: {
            include: {
              categoria: true,
            },
          },
          registros: {
            include: {
              localizacao: true,
              usuario: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });
      
      if (!plantaCompleta) {
        throw new Error('Erro ao recuperar planta cadastrada');
      }
      
      return await this.formatPlanta(plantaCompleta);
    });
  }
  
  async atualizarPlanta(id: string, data: Partial<CreatePlantaRequest>): Promise<Planta> {
    const updateData: any = {};
    
    if (data.nomePopular) updateData.nomePopular = data.nomePopular;
    if (data.nomeCientifico !== undefined) updateData.nomeCientifico = data.nomeCientifico;
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.comestivel !== undefined) updateData.comestivel = data.comestivel;
    if (data.medicinal !== undefined) updateData.medicinal = data.medicinal;
    if (data.nativa !== undefined) updateData.nativa = data.nativa;
    if (data.usos !== undefined) updateData.usos = data.usos;
    if (data.cuidados !== undefined) updateData.cuidados = data.cuidados;
    
    const planta = await prisma.planta.update({
      where: { id },
      data: updateData,
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
        registros: {
          include: {
            localizacao: true,
            usuario: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });
    
    return await this.formatPlanta(planta);
  }
  
  async deletarPlanta(id: string): Promise<void> {
    await prisma.planta.delete({
      where: { id },
    });
  }
  
  async avaliarPlanta(userId: string, plantaId: string, avaliacao: number, comentario?: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Check if user already rated
      const existingAvaliacao = await tx.avaliacao.findUnique({
        where: {
          usuarioId_plantaId: {
            usuarioId: userId,
            plantaId,
          },
        },
      });
      
      if (existingAvaliacao) {
        // Update existing rating
        await tx.avaliacao.update({
          where: {
            usuarioId_plantaId: {
              usuarioId: userId,
              plantaId,
            },
          },
          data: { valor: avaliacao },
        });
      } else {
        // Create new rating
        await tx.avaliacao.create({
          data: {
            usuarioId: userId,
            plantaId,
            valor: avaliacao,
          },
        });
      }
      
      // Add comment if provided
      if (comentario) {
        // Get the latest registration for this plant
        const ultimoRegistro = await tx.registroPlanta.findFirst({
          where: { plantaId },
          orderBy: { dataRegistro: 'desc' },
        });
        
        if (ultimoRegistro) {
          await tx.comentario.create({
            data: {
              usuarioId: userId,
              registroId: ultimoRegistro.id,
              texto: comentario,
              avaliacao,
            },
          });
        }
      }
    });
  }
  
  async atualizarStatusRegistro(registroId: string, status: StatusRegistro, moderadorId: string): Promise<void> {
    await prisma.registroPlanta.update({
      where: { id: registroId },
      data: { status },
    });
    
    // Update user reputation for moderation actions
    if (status === StatusRegistro.APROVADO) {
      // Add reputation points for approval
      // You can implement this based on your business logic
    }
  }
  
  private async formatPlanta(planta: any): Promise<Planta> {
    // Calculate average rating
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { plantaId: planta.id },
    });
    
    const avaliacaoMedia = avaliacoes.length > 0
      ? avaliacoes.reduce((sum, av) => sum + av.valor, 0) / avaliacoes.length
      : 0;
    
    // Get image URL (first image from latest registration)
    const primeiroRegistro = planta.registros[0];
    let imagemUrl = null;
    
    if (primeiroRegistro) {
      const imagens = await prisma.imagemPlanta.findMany({
        where: { registroId: primeiroRegistro.id },
        take: 1,
      });
      
      if (imagens.length > 0) {
        imagemUrl = imagens[0].url;
      }
    }
    
    return {
      id: planta.id,
      nomePopular: planta.nomePopular,
      nomeCientifico: planta.nomeCientifico,
      descricao: planta.descricao,
      comestivel: planta.comestivel,
      medicinal: planta.medicinal,
      nativa: planta.nativa,
      usos: planta.usos,
      cuidados: planta.cuidados,
      imagemUrl,
      categorias: planta.categorias.map((cp: any) => ({
        id: cp.categoria.id,
        nome: cp.categoria.nome,
        descricao: cp.categoria.descricao,
        tipo: cp.categoria.tipo,
      })),
      localizacoes: planta.registros.map((registro: any) => ({
        id: registro.localizacao.id,
        latitude: registro.localizacao.latitude,
        longitude: registro.localizacao.longitude,
        endereco: registro.localizacao.endereco,
        descricao: registro.localizacao.descricao,
        regiao: registro.localizacao.regiao,
      })),
      usuarioRegistro: primeiroRegistro?.usuario || { id: '', nome: 'Desconhecido' },
      dataRegistro: primeiroRegistro?.dataRegistro || planta.createdAt,
      status: primeiroRegistro?.status || StatusRegistro.PENDENTE,
      avaliacaoMedia,
      totalRegistros: planta.registros.length,
      totalAvaliacoes: avaliacoes.length,
    };
  }
}