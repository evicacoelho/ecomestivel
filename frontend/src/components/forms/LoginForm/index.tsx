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
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().required('Senha é obrigatória').min(6, 'Mínimo 6 caracteres'),
});

type FormData = yup.InferType<typeof schema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login, error, clearError, loading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    clearError();
    const result = await login(data.email, data.senha);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Entrar na sua conta
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" paragraph>
        Acesse para registrar plantas e contribuir com a comunidade
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          
          <Box textAlign="right">
            <Link
              component={RouterLink}
              to="/esqueci-senha"
              variant="body2"
              underline="hover"
            >
              Esqueci minha senha
            </Link>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            fullWidth
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          
          <Box textAlign="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onSwitchToRegister}
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default LoginForm;