import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, PerfilUsuario } from '@prisma/client';
import { config } from '../config/environment';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserProfile,
  JwtPayload, 
} from '../types/auth.types';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      throw new Error('Email já está em uso');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(data.senha, salt);
    
    // Create user
    const user = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash,
        perfil: PerfilUsuario.USUARIO,
        reputacao: 0,
      },
    });
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil as PerfilUsuario,
        avatarUrl: user.avatarUrl,
        dataCadastro: user.dataCadastro,
        reputacao: user.reputacao,
      },
      token,
    };
  }
  
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(data.senha, user.senhaHash);
    
    if (!validPassword) {
      throw new Error('Credenciais inválidas');
    }
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil as PerfilUsuario,
        avatarUrl: user.avatarUrl,
        dataCadastro: user.dataCadastro,
        reputacao: user.reputacao,
      },
      token,
    };
  }
  
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            plantasRegistradas: true,
            comentarios: true,
          },
        },
      },
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil as PerfilUsuario,
      avatarUrl: user.avatarUrl,
      dataCadastro: user.dataCadastro,
      reputacao: user.reputacao,
      totalPlantas: user._count.plantasRegistradas,
      totalComentarios: user._count.comentarios,
    };
  }
  
  async updateProfile(userId: string, data: Partial<{ nome: string; avatarUrl: string | null }>): Promise<UserProfile> {
    const user = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome: data.nome,
        avatarUrl: data.avatarUrl,
      },
      include: {
        _count: {
          select: {
            plantasRegistradas: true,
            comentarios: true,
          },
        },
      },
    });
    
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil as PerfilUsuario,
      avatarUrl: user.avatarUrl,
      dataCadastro: user.dataCadastro,
      reputacao: user.reputacao,
      totalPlantas: user._count.plantasRegistradas,
      totalComentarios: user._count.comentarios,
    };
  }
  
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.usuario.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Don't reveal if user exists
      return;
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    
    // TODO: Send email with reset link
    console.log('Reset token (para testes):', resetToken);
  }
  
  async resetPassword(token: string, novaSenha: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(novaSenha, salt);
      
      await prisma.usuario.update({
        where: { id: decoded.userId },
        data: { senhaHash },
      });
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
  
  private generateToken(user: any): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      perfil: user.perfil as PerfilUsuario,
    };
    
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }
}