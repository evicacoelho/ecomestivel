import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Chip, Button} from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PlantaCard from '../../components/plantas/PlantaCard';
import GridContainer from '../../components/common/GridContainer';
import GridItem from '../../components/common/GridItem';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const MinhasPlantas: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // MOCK DATA
  const plantasRegistradas = [
    {
      id: '1',
      nomePopular: 'Mangueira',
      nomeCientifico: 'Mangifera indica',
      descricao: 'Árvore frutífera tropical',
      comestivel: true,
      medicinal: false,
      nativa: false,
      imagemUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      status: 'APROVADO' as const,
      avaliacaoMedia: 4.5,
      totalRegistros: 1,
      totalAvaliacoes: 12,
      localizacoes: [{ 
        id: 'loc1',
        endereco: 'Parque da Cidade',
        latitude: -15.7942,
        longitude: -47.8822,
        descricao: 'Próximo ao estacionamento',
        usuarioRegistro: { id: '1', nome: 'Você' },
        dataRegistro: '2024-01-15T10:30:00Z'
      }],
      usuarioRegistro: { id: '1', nome: 'Você' },
      dataRegistro: '2024-01-15T10:30:00Z',
      categorias: ['COMESTIVEL', 'EXOTICA'],
    },
    
  ];

  const plantasPendentes = [
    {
      id: '2',
      nomePopular: 'Planta Teste',
      nomeCientifico: '',
      descricao: 'Aguardando validação',
      comestivel: true,
      medicinal: true,
      nativa: true,
      imagemUrl: '',
      status: 'PENDENTE' as const, 
      avaliacaoMedia: 0,
      totalRegistros: 1,
      totalAvaliacoes: 0,
      localizacoes: [{ 
        id: 'loc2',
        endereco: 'Jardim Botânico',
        latitude: -15.7930,
        longitude: -47.8800,
        descricao: 'Canteiro principal',
        usuarioRegistro: { id: '1', nome: 'Você' },
        dataRegistro: '2024-01-20T14:20:00Z'
      }],
      usuarioRegistro: { id: '1', nome: 'Você' },
      dataRegistro: '2024-01-20T14:20:00Z',
      categorias: ['COMESTIVEL', 'MEDICINAL', 'NATIVA'],
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Minhas Plantas
        </Typography>
        <Button
          component={Link}
          to="/registrar-planta"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nova Planta
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Registradas (${plantasRegistradas.length})`} />
          <Tab label={`Pendentes (${plantasPendentes.length})`} />
          <Tab label="Favoritas (0)" />
          <Tab label="Contribuições (0)" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Plantas Registradas
          </Typography>
          <Button startIcon={<FilterListIcon />} variant="outlined">
            Filtrar
          </Button>
        </Box>

        {plantasRegistradas.length > 0 ? (
          <GridContainer spacing={3}>
            {plantasRegistradas.map((planta) => (
              <GridItem xs={12} sm={6} md={4} key={planta.id}>
                <PlantaCard planta={planta} />
              </GridItem>
            ))}
          </GridContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Você ainda não registrou nenhuma planta
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Comece contribuindo com o catálogo registrando plantas que você conhece
            </Typography>
            <Button
              component={Link}
              to="/registrar-planta"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Registrar Primeira Planta
            </Button>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Plantas Pendentes
          </Typography>
          <Chip label="Aguardando validação" color="warning" />
        </Box>

        {plantasPendentes.length > 0 ? (
          <GridContainer spacing={3}>
            {plantasPendentes.map((planta) => (
              <GridItem xs={12} sm={6} md={4} key={planta.id}>
                <PlantaCard planta={planta} />
              </GridItem>
            ))}
          </GridContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma planta pendente
            </Typography>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Funcionalidade em desenvolvimento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Em breve você poderá favoritar plantas
          </Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Funcionalidade em desenvolvimento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Em breve você verá suas contribuições em outras plantas
          </Typography>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default MinhasPlantas;