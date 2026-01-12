import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '6rem',
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Página não encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          A página que você está procurando pode ter sido removida, ter seu nome alterado ou estar temporariamente indisponível.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
            size="large"
          >
            Página Inicial
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            size="large"
          >
            Voltar
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Precisa de ajuda? Tente:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', mt: 1 }}>
            <li>
              <Typography variant="body2">
                Verificar se o endereço está correto
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Voltar para a página anterior
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Ir para a página inicial
              </Typography>
            </li>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;