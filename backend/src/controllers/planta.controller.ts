import { Request, Response } from 'express';
import { PlantaService } from '../services/planta.service';
import { plantaValidation } from '../utils/validation';
import { validate } from '../middlewares/validation.middleware';

const plantaService = new PlantaService();

export class PlantaController {
  async buscarPlantas(req: Request, res: Response) {
    try {
      const filtros = {
        search: req.query.search as string,
        categoria: req.query.categoria 
          ? (Array.isArray(req.query.categoria) 
            ? req.query.categoria as string[] 
            : [req.query.categoria as string])
          : undefined,
        comestivel: req.query.comestivel ? req.query.comestivel === 'true' : undefined,
        medicinal: req.query.medicinal ? req.query.medicinal === 'true' : undefined,
        nativa: req.query.nativa ? req.query.nativa === 'true' : undefined,
        latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
        longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
        raioKm: req.query.raioKm ? parseFloat(req.query.raioKm as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const result = await plantaService.buscarPlantas(filtros);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPlantasProximas(req: Request, res: Response) {
    try {
      const { latitude, longitude, raioKm = '5', limit = '50' } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ 
          error: 'Latitude e longitude são obrigatórias' 
        });
      }

      const result = await plantaService.buscarPlantasProximas(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseFloat(raioKm as string),
        parseInt(limit as string)
      );
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async obterPlantaPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const planta = await plantaService.obterPlantaPorId(id as string);
      res.json(planta);
    } catch (error: any) {
      if (error.message === 'Planta não encontrada') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async cadastrarPlanta(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const dados = JSON.parse(req.body.dados || '{}');
      const images = req.files as Express.Multer.File[];

      const mockReq = { body: dados } as Request;
      await Promise.all(plantaValidation.map(validation => validation.run(mockReq)));
      
      const errors = {
        nomePopular: !dados.nomePopular ? 'Nome popular é obrigatório' : null,
        descricao: !dados.descricao ? 'Descrição é obrigatória' : 
                  dados.descricao.length < 20 ? 'Descrição deve ter no mínimo 20 caracteres' : null,
        categoria: !dados.categoria || !Array.isArray(dados.categoria) || dados.categoria.length === 0 
                  ? 'Pelo menos uma categoria é obrigatória' : null,
        latitude: !dados.latitude ? 'Latitude é obrigatória' : 
                 isNaN(parseFloat(dados.latitude)) ? 'Latitude inválida' : null,
        longitude: !dados.longitude ? 'Longitude é obrigatória' : 
                  isNaN(parseFloat(dados.longitude)) ? 'Longitude inválida' : null,
      };

      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        return res.status(400).json({ errors: errorMessages });
      }

      const result = await plantaService.cadastrarPlanta(userId, dados, images);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Erro ao cadastrar planta:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async atualizarPlanta(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { id } = req.params;
      const planta = await plantaService.atualizarPlanta(id as string, req.body);
      res.json(planta);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletarPlanta(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { id } = req.params;
      await plantaService.deletarPlanta(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async avaliarPlanta(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { id } = req.params;
      const { avaliacao, comentario } = req.body;

      if (!avaliacao || avaliacao < 1 || avaliacao > 5) {
        return res.status(400).json({ 
          error: 'Avaliação deve ser um número entre 1 e 5' 
        });
      }

      await plantaService.avaliarPlanta(userId, id as string, avaliacao, comentario);
      res.json({ message: 'Avaliação registrada com sucesso' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}