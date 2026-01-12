import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActions,
  Button,
  Rating,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Person,
  CheckCircle,
  Pending,
} from '@mui/icons-material';

interface PlantaCardProps {
  planta: {
    id: string;
    nomePopular: string;
    nomeCientifico?: string;
    descricao: string;
    comestivel: boolean;
    medicinal: boolean;
    nativa: boolean;
    imagemUrl?: string;
    status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
    avaliacaoMedia: number;
    totalRegistros: number;
    localizacoes: Array<{
      endereco?: string;
    }>;
    usuarioRegistro: {
      nome: string;
    };
    dataRegistro: string;
  };
  showActions?: boolean;
}

const PlantaCard: React.FC<PlantaCardProps> = ({ planta, showActions = true }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {planta.imagemUrl && (
        <CardMedia
          component="img"
          height="200"
          image={planta.imagemUrl}
          alt={planta.nomePopular}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Cabeçalho com status */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              {planta.nomePopular}
            </Typography>
            {planta.nomeCientifico && (
              <Typography variant="caption" color="text.secondary" display="block">
                {planta.nomeCientifico}
              </Typography>
            )}
          </Box>
          <Box>
            {planta.status === 'APROVADO' ? (
              <CheckCircle color="success" fontSize="small" />
            ) : (
              <Pending color="warning" fontSize="small" />
            )}
          </Box>
        </Box>

        {/* Tags */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {planta.comestivel && (
            <Chip label="Comestível" size="small" color="success" />
          )}
          {planta.medicinal && (
            <Chip label="Medicinal" size="small" color="error" />
          )}
          {planta.nativa ? (
            <Chip label="Nativa" size="small" color="primary" />
          ) : (
            <Chip label="Exótica" size="small" color="warning" />
          )}
        </Box>

        {/* Descrição */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {planta.descricao}
        </Typography>

        {/* Informações */}
        <Box display="flex" flexDirection="column" gap={1}>
          {/* Avaliação */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Rating
              value={planta.avaliacaoMedia}
              readOnly
              precision={0.5}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              ({planta.avaliacaoMedia.toFixed(1)})
            </Typography>
          </Box>

          {/* Localização */}
          {planta.localizacoes[0]?.endereco && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {planta.localizacoes[0].endereco}
              </Typography>
            </Box>
          )}

          {/* Registrante e data */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Person fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {planta.usuarioRegistro.nome}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {formatDate(planta.dataRegistro)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions>
          <Button
            component={Link}
            to={`/plantas/${planta.id}`}
            size="small"
            fullWidth
          >
            Ver Detalhes
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PlantaCard;