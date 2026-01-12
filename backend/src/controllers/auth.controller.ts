import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { loginValidation, registerValidation } from '../utils/validation';
import { validate } from '../middlewares/validation.middleware';
import prisma from '../config/database';
import { config } from '../config/environment';
import { JwtPayload } from '../types/auth.types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      await Promise.all(registerValidation.map(validation => validation.run(req)));
      await validate(req, res, () => {});

      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      await Promise.all(loginValidation.map(validation => validation.run(req)));
      await validate(req, res, () => {});

      const result = await authService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const profile = await authService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const profile = await authService.updateProfile(userId, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      await authService.forgotPassword(email);
      res.json({ message: 'Email de recuperação enviado, se o usuário existir' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, novaSenha } = req.body;
      if (!token || !novaSenha) {
        return res.status(400).json({ 
          error: 'Token e nova senha são obrigatórios' 
        });
      }

      await authService.resetPassword(token, novaSenha);
      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      
      // Buscar usuário no banco
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true,
          avatarUrl: true,
          dataCadastro: true,
          reputacao: true,
        },
      });
      
      if (!user) {
        return res.status(401).json({ valid: false });
      }
      
      // Contar estatísticas
      const [totalPlantas, totalComentarios] = await Promise.all([
        prisma.registroPlanta.count({ where: { usuarioId: user.id } }),
        prisma.comentario.count({ where: { usuarioId: user.id } }),
      ]);
      
      return res.json({
        valid: true,
        user: {
          ...user,
          totalPlantas,
          totalComentarios,
          dataCadastro: user.dataCadastro.toISOString(), // Converter para string
        },
      });
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ valid: false });
    }
  }
}