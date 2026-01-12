import React from 'react';
import { Box, Container, Typography, Link, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';

const Login: React.FC = () => {
  const handleSuccess = () => {
    window.location.href = '/';
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bem-vindo de volta!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Entre na sua conta para acessar todas as funcionalidades
          </Typography>

          <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => window.location.href = '/cadastro'} />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Ao entrar, você concorda com nossos{' '}
              <Link component={RouterLink} to="/termos" underline="hover">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link component={RouterLink} to="/privacidade" underline="hover">
                Política de Privacidade
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;