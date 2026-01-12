import { body } from 'express-validator';

export const registerValidation = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  
  body('confirmarSenha')
    .notEmpty().withMessage('Confirmação de senha é obrigatória')
    .custom((value, { req }) => value === req.body.senha)
    .withMessage('As senhas não coincidem'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido'),
  
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória'),
];

export const plantaValidation = [
  body('nomePopular')
    .trim()
    .notEmpty().withMessage('Nome popular é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome popular deve ter no mínimo 3 caracteres'),
  
  body('descricao')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ min: 20 }).withMessage('Descrição deve ter no mínimo 20 caracteres'),
  
  body('categoria')
    .isArray().withMessage('Categoria deve ser um array')
    .notEmpty().withMessage('Pelo menos uma categoria é obrigatória'),
  
  body('latitude')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude inválida'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida'),
];

export const comentarioValidation = [
  body('texto')
    .trim()
    .notEmpty().withMessage('Texto é obrigatório')
    .isLength({ min: 1, max: 1000 }).withMessage('Texto deve ter entre 1 e 1000 caracteres'),
  
  body('avaliacao')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
];