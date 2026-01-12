import React from 'react';
import { Box, Typography, Paper, Avatar, Button, Chip, Divider } from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn,
  Spa,
  Comment,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import GridContainer from '../../components/common/GridContainer';
import GridItem from '../../components/common/GridItem';

const Perfil: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6">Faça login para ver seu perfil</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho do perfil */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Avatar
            sx={{ width: 100, height: 100, fontSize: 40 }}
            src={user.avatarUrl}
          >
            {user.nome.charAt(0)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4">{user.nome}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Chip
              label={user.perfil}
              color={user.perfil === 'ADMIN' ? 'error' : user.perfil === 'MODERADOR' ? 'warning' : 'primary'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Editar Perfil
          </Button>
        </Box>
        
        <GridContainer spacing={2}>
          <GridItem xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">152</Typography>
              <Typography variant="body2" color="text.secondary">Reputação</Typography>
            </Paper>
          </GridItem>
          <GridItem xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">24</Typography>
              <Typography variant="body2" color="text.secondary">Plantas</Typography>
            </Paper>
          </GridItem>
          <GridItem xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">48</Typography>
              <Typography variant="body2" color="text.secondary">Comentários</Typography>
            </Paper>
          </GridItem>
          <GridItem xs={6} sm={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">12</Typography>
              <Typography variant="body2" color="text.secondary">Validações</Typography>
            </Paper>
          </GridItem>
        </GridContainer>
      </Paper>

      <GridContainer spacing={3}>
        {/* Atividades recentes */}
        <GridItem xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Atividades Recentes
            </Typography>
            
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {item === 1 && <Spa fontSize="small" color="primary" />}
                  {item === 2 && <Comment fontSize="small" color="secondary" />}
                  {item === 3 && <Star fontSize="small" color="warning" />}
                  <Typography variant="body2">
                    {item === 1 && 'Registrou uma nova planta: Mangueira'}
                    {item === 2 && 'Comentou em: Planta de Boldo'}
                    {item === 3 && 'Avaliou: Pitangueira com 5 estrelas'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Há {item} dias atrás
                </Typography>
              </Box>
            ))}
            
            <Button fullWidth variant="outlined">
              Ver todas as atividades
            </Button>
          </Paper>
        </GridItem>

        {/* Estatísticas */}
        <GridItem xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Plantas por categoria:
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Comestíveis</Typography>
                  <Typography variant="body2">12</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Medicinais</Typography>
                  <Typography variant="body2">8</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Nativas</Typography>
                  <Typography variant="body2">15</Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Membro desde:
              </Typography>
              <Typography variant="body1">
                {new Date(user.dataCadastro).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={<LocationOn />}
              sx={{ mt: 2 }}
            >
              Minhas Localizações
            </Button>
          </Paper>
        </GridItem>
      </GridContainer>
    </Box>
  );
};

export default Perfil;