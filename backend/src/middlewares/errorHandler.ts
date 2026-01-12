import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Erro:', error);

  // Erros de validação
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      error: error.message
    });
  }

  // Erros do multer (upload)
  if (error instanceof Error && error.message.includes('Tipo de arquivo')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};