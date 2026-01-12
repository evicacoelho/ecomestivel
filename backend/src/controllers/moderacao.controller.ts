import { Request, Response } from 'express';
import { PlantaService } from '../services/planta.service';
import { StatusRegistro } from '@prisma/client';

const plantaService = new PlantaService();

export class ModeracaoController {
  async listarPendentes(req: Request, res: Response) {
    try {
      // Esta função seria implementada para listar registros pendentes
      // Por enquanto retornamos um array vazio
      res.json([]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async aprovarRegistro(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { registroId } = req.params;
      await plantaService.atualizarStatusRegistro(
        registroId as string, 
        StatusRegistro.APROVADO, 
        userId
      );
      
      res.json({ message: 'Registro aprovado com sucesso' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async rejeitarRegistro(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { registroId } = req.params;
      const { motivo } = req.body;

      await plantaService.atualizarStatusRegistro(
        registroId as string, 
        StatusRegistro.REJEITADO, 
        userId
      );
      
      res.json({ 
        message: 'Registro rejeitado', 
        motivo: motivo || 'Motivo não especificado' 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async colocarEmAnalise(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { registroId } = req.params;
      await plantaService.atualizarStatusRegistro(
        registroId as string, 
        StatusRegistro.EM_ANALISE, 
        userId
      );
      
      res.json({ message: 'Registro colocado em análise' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}