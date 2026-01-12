import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Button } from '@mui/material';
import { FilterList, MyLocation } from '@mui/icons-material';
import InteractiveMap from '../../components/mapa/InteractiveMap';
import GridItem from '../../components/common/GridItem';

const MapPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mapa Interativo
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Explore plantas na sua região
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filtrar
          </Button>
        </Box>
        
        <Box sx={{ height: 600, mb: 2 }}>
          <InteractiveMap
            editable={false}
            initialCenter={[-15.7942, -47.8822]}
            initialZoom={13}
            height="100%"
          />
        </Box>
        
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip label="Todas" color="primary" />
          <Chip label="Comestíveis" />
          <Chip label="Medicinais" />
          <Chip label="Nativas" />
          <Chip label="Exóticas" />
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        <GridItem xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Legenda
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#22c55e',
                  }}
                />
                <Typography variant="body2">Comestível e Medicinal</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#3b82f6',
                  }}
                />
                <Typography variant="body2">Comestível</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#ef4444',
                  }}
                />
                <Typography variant="body2">Medicinal</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#666666',
                  }}
                />
                <Typography variant="body2">Outras plantas</Typography>
              </Box>
            </Box>
          </Paper>
        </GridItem>
        
        <GridItem xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dicas
            </Typography>
            <Typography variant="body2" paragraph>
              • Clique nos marcadores para ver detalhes das plantas
            </Typography>
            <Typography variant="body2" paragraph>
              • Use o botão <MyLocation fontSize="small" /> para centralizar no seu local
            </Typography>
            <Typography variant="body2" paragraph>
              • Arraste o mapa para explorar diferentes áreas
            </Typography>
            <Button variant="contained" fullWidth>
              Registrar Nova Planta no Mapa
            </Button>
          </Paper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MapPage;