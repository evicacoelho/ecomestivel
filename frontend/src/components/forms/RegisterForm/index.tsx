import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().required('Senha é obrigatória').min(6, 'Mínimo 6 caracteres'),
  confirmarSenha: yup.string()
    .required('Confirme sua senha')
    .oneOf([yup.ref('senha')], 'Senhas não conferem'),
});

type FormData = yup.InferType<typeof schema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register: registerAuth, error, clearError, loading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    clearError();
    const result = await registerAuth(data.nome, data.email, data.senha, data.confirmarSenha);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Criar Nova Conta
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            {...register('nome')}
            label="Nome Completo"
            fullWidth
            error={!!errors.nome}
            helperText={errors.nome?.message}
            disabled={loading}
          />
          
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
          />
          
          <TextField
            {...register('senha')}
            label="Senha"
            type="password"
            fullWidth
            error={!!errors.senha}
            helperText={errors.senha?.message}
            disabled={loading}
          />
          
          <TextField
            {...register('confirmarSenha')}
            label="Confirmar Senha"
            type="password"
            fullWidth
            error={!!errors.confirmarSenha}
            helperText={errors.confirmarSenha?.message}
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            fullWidth
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          
          <Box textAlign="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onSwitchToLogin}
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Entre aqui
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default RegisterForm;