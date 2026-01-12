import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn,
  CalendarToday,
  Person,
  CheckCircle,
  Warning,
  Comment as CommentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { plantaApi } from '../../services/api/plantas';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import GridContainer from '../../components/common/GridContainer';
import GridItem from '../../components/common/GridItem';

const PlantaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: planta, isLoading, error } = useQuery({
    queryKey: ['planta', id],
    queryFn: () => plantaApi.obterPorId(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner message="Carregando detalhes da planta..." />;
  }

  if (error || !planta) {
    return (
      <ErrorMessage
        title="Erro ao carregar planta"
        message={error instanceof Error ? error.message : 'Planta não encontrada'}
        onRetry={() => navigate('/plantas')}
      />
    );
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/plantas')}
          sx={{ textTransform: 'none' }}
        >
          Voltar
        </Button>
        <Typography variant="h4">
          {planta.nomePopular}
        </Typography>
        {planta.status === 'APROVADO' ? (
          <CheckCircle color="success" />
        ) : (
          <Warning color="warning" />
        )}
      </Box>

      <GridContainer spacing={3}>
        {/* Coluna principal */}
        <GridItem xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {planta.imagemUrl && (
              <Box
                component="img"
                src={planta.imagemUrl}
                alt={planta.nomePopular}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 3,
                }}
              />
            )}

            <Typography variant="h5" gutterBottom>
              {planta.nomePopular}
            </Typography>
            
            {planta.nomeCientifico && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {planta.nomeCientifico}
              </Typography>
            )}

            {/* Tags */}
            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
              {planta.comestivel && (
                <Chip label="Comestível" color="success" />
              )}
              {planta.medicinal && (
                <Chip label="Medicinal" color="error" />
              )}
              {planta.nativa ? (
                <Chip label="Nativa" color="primary" />
              ) : (
                <Chip label="Exótica" color="warning" />
              )}
              {planta.categorias.map((cat) => (
                <Chip key={cat} label={cat} variant="outlined" />
              ))}
            </Box>


            {/* Descrição */}
            <Typography variant="body1" paragraph>
              {planta.descricao}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Usos e Cuidados */}
            <GridContainer spacing={3}>
              {planta.usos && (
                <GridItem xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Usos
                  </Typography>
                  <Typography variant="body2">
                    {planta.usos}
                  </Typography>
                </GridItem>
              )}
              
              {planta.cuidados && (
                <GridItem xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Cuidados
                  </Typography>
                  <Typography variant="body2">
                    {planta.cuidados}
                  </Typography>
                </GridItem>
              )}
            </GridContainer>
          </Paper>

          {/* Comentários */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comentários e Avaliações
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CommentIcon />}
              sx={{ mb: 2 }}
            >
              Adicionar Comentário
            </Button>
            <Typography variant="body2" color="text.secondary">
              Funcionalidade de comentários em breve...
            </Typography>
          </Paper>
        </GridItem>

        {/* Coluna lateral */}
        <GridItem xs={12} md={4}>
          {/* Informações do registro */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações do Registro
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Registrado por"
                  secondary={planta.usuarioRegistro.nome}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary="Data do Registro"
                  secondary={new Date(planta.dataRegistro).toLocaleDateString('pt-BR')}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText
                  primary="Status"
                  secondary={planta.status === 'APROVADO' ? 'Aprovado' : 'Em análise'}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Localizações */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Localizações
            </Typography>
            
            {planta.localizacoes.map((localizacao) => (
              <Box key={localizacao.id} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <LocationOn fontSize="small" />
                  <Typography variant="subtitle2">
                    {localizacao.endereco || 'Local registrado'}
                  </Typography>
                </Box>
                {localizacao.descricao && (
                  <Typography variant="body2" color="text.secondary">
                    {localizacao.descricao}
                  </Typography>
                )}
              </Box>
            ))}
            
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LocationOn />}
              onClick={() => navigate(`/mapa?planta=${planta.id}`)}
            >
              Ver no Mapa
            </Button>
          </Paper>

          {/* Ações */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ações
            </Typography>
            
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate(`/registrar?editar=${planta.id}`)}
              startIcon={<EditIcon />}
            >
              Sugerir Edição
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/registrar')}
            >
              Registrar Planta Similar
            </Button>
          </Paper>
        </GridItem>
      </GridContainer>
    </Box>
  );
};

export default PlantaDetalhes;