import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PlantaForm from '../../components/plantas/PlantaForm/index.tsx';

const RegistrarPlanta: React.FC = () => {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h4" gutterBottom>
          Registrar Nova Planta
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Contribua com o catálogo colaborativo de plantas urbanas. 
          Preencha as informações abaixo para registrar uma nova planta.
        </Typography>
      </Paper>
      
      <PlantaForm />
    </Box>
  );
};

export default RegistrarPlanta;