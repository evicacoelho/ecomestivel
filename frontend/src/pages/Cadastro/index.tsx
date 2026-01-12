import React from 'react';
import { Box, Container, Typography, Link, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm';

const Cadastro: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Criar Conta
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Junte-se à comunidade e contribua com o catálogo de plantas urbanas
          </Typography>

          <RegisterForm onSuccess={() => window.location.href = '/'} onSwitchToLogin={() => window.location.href = '/login'} />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Ao criar uma conta, você concorda com nossos{' '}
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

export default Cadastro;