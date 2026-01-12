import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error(err);
  }
  
  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflito',
      message: 'Já existe um registro com esses dados',
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Não encontrado',
      message: 'Registro não encontrado',
    });
  }
  
  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};