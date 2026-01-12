import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  IconButton,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import PlantaCard from '../../components/plantas/PlantaCard';
import { plantaApi } from '../../services/api/plantas';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import GridContainer from '../../components/common/GridContainer';
import GridItem from '../../components/common/GridItem';

const Plantas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string[]>([]);
  const [comestivel, setComestivel] = useState<boolean | undefined>(undefined);
  const [medicinal, setMedicinal] = useState<boolean | undefined>(undefined);
  const [nativa, setNativa] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plantas', page, search, categoria, comestivel, medicinal, nativa],
    queryFn: () => plantaApi.buscar({
      search,
      categoria: categoria.length > 0 ? categoria : undefined,
      comestivel,
      medicinal,
      nativa,
      page,
      limit: 12,
    }),
  });

  const handleCategoriaChange = (event: SelectChangeEvent<string[]>) => {
    setCategoria(event.target.value as string[]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const clearFilters = () => {
    setSearch('');
    setCategoria([]);
    setComestivel(undefined);
    setMedicinal(undefined);
    setNativa(undefined);
    setPage(1);
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando plantas..." fullScreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar plantas"
        message={error instanceof Error ? error.message : 'Ocorreu um erro'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Catálogo de Plantas
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            <GridViewIcon />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'default'}
          >
            <ListIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Barra de busca */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar plantas por nome, espécie ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {/* Filtros */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterListIcon />
          <Typography variant="subtitle1">Filtros</Typography>
        </Box>
        
        <GridContainer spacing={2}>
          <GridItem xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categorias</InputLabel>
              <Select
                multiple
                value={categoria}
                onChange={handleCategoriaChange}
                label="Categorias"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="COMESTIVEL">Comestível</MenuItem>
                <MenuItem value="MEDICINAL">Medicinal</MenuItem>
                <MenuItem value="NATIVA">Nativa</MenuItem>
                <MenuItem value="EXOTICA">Exótica</MenuItem>
                <MenuItem value="URBANA">Urbana</MenuItem>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem xs={12} md={2}>
            <Button
              fullWidth
              variant={comestivel === true ? 'contained' : 'outlined'}
              onClick={() => setComestivel(comestivel === true ? undefined : true)}
            >
              Comestível
            </Button>
          </GridItem>
          
          <GridItem xs={12} md={2}>
            <Button
              fullWidth
              variant={medicinal === true ? 'contained' : 'outlined'}
              onClick={() => setMedicinal(medicinal === true ? undefined : true)}
            >
              Medicinal
            </Button>
          </GridItem>
          
          <GridItem xs={12} md={2}>
            <Button
              fullWidth
              variant={nativa === true ? 'contained' : 'outlined'}
              onClick={() => setNativa(nativa === true ? undefined : true)}
            >
              Nativa
            </Button>
          </GridItem>
          
          <GridItem xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={clearFilters}
            >
              Limpar Filtros
            </Button>
          </GridItem>
        </GridContainer>
      </Box>

      {/* Resultados */}
      <Typography variant="h6" gutterBottom>
        {data?.total || 0} plantas encontradas
      </Typography>

      {data?.data && data.data.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {data.data.map((planta) => (
              <GridItem key={planta.id} xs={12} sm={6} md={4} lg={viewMode === 'grid' ? 3 : 12}>
                <PlantaCard planta={planta} />
              </GridItem>
            ))}
          </Grid>

          {/* Paginação */}
          {data.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma planta encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros ou cadastre uma nova planta
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Plantas;