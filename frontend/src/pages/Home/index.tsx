import React from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  Box,
  Stack,
} from '@mui/material'
import {
  Map as MapIcon,
  Spa as PlantIcon,
  Add as AddIcon,
  VerifiedUser,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const features = [
    {
      icon: <MapIcon fontSize="large" />,
      title: 'Mapa Interativo',
      description: 'Encontre plantas comestíveis perto de você',
    },
    {
      icon: <PlantIcon fontSize="large" />,
      title: 'Catálogo Colaborativo',
      description: 'Compartilhe conhecimento sobre plantas urbanas',
    },
    {
      icon: <AddIcon fontSize="large" />,
      title: 'Registro Fácil',
      description: 'Adicione novas plantas com fotos e localização',
    },
    {
      icon: <VerifiedUser fontSize="large" />,
      title: 'Informações Validadas',
      description: 'Conteúdo verificado por especialistas e comunidade',
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.50',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                Descubra as plantas comestíveis da sua{' '}
                <Box component="span" color="primary.main">
                  cidade
                </Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Conecte-se com a natureza urbana. Encontre, compartilhe e aprendo sobre
                plantas comestíveis e medicinais ao seu redor.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/mapa"
                  variant="contained"
                  size="large"
                  startIcon={<MapIcon />}
                >
                  Explorar Mapa
                </Button>
                <Button
                  component={Link}
                  to="/registrar-planta"
                  variant="outlined"
                  size="large"
                  startIcon={<AddIcon />}
                >
                  Registrar Planta
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Plantas urbanas"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" mb={6}>
          Como funciona
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: 1,
                  borderColor: 'grey.200',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Box sx={{ color: 'primary.main' }}>{feature.icon}</Box>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Junte-se à comunidade
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Contribua para um banco de dados colaborativo sobre a flora urbana
        </Typography>
        <Button
          component={Link}
          to="/cadastro"
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ px: 6 }}
        >
          Começar Agora
        </Button>
      </Container>
    </Box>
  )
}

export default Home