import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().required('Senha é obrigatória').min(6, 'Mínimo 6 caracteres'),
  confirmarSenha: yup.string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('senha')], 'As senhas não coincidem'),
});

type FormData = yup.InferType<typeof schema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);
    
    try {
      await registerUser(data.nome, data.email, data.senha, data.confirmarSenha);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Criar Conta
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Junte-se à comunidade e compartilhe suas plantas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        {...register('nome')}
        label="Nome completo"
        fullWidth
        margin="normal"
        error={!!errors.nome}
        helperText={errors.nome?.message}
        disabled={loading}
      />

      <TextField
        {...register('email')}
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={loading}
      />

      <TextField
        {...register('senha')}
        label="Senha"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.senha}
        helperText={errors.senha?.message}
        disabled={loading}
      />

      <TextField
        {...register('confirmarSenha')}
        label="Confirmar Senha"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.confirmarSenha}
        helperText={errors.confirmarSenha?.message}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Já tem uma conta?{' '}
          <MuiLink component={Link} to="/login">
            Faça login
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;