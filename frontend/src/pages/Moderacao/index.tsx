import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import GridItem from '../../components/common/GridItem';
import GridContainer from '../../components/common/GridContainer';

interface Registro {
  id: string;
  planta: string;
  usuario: string;
  data: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  tipo: 'NOVO' | 'EDIÇÃO';
}

const Moderacao: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [tipoFilter, setTipoFilter] = useState<string>('TODOS');

  // MOCK DATA
  const registros: Registro[] = [
    { id: '1', planta: 'Mangueira', usuario: 'João Silva', data: '15/01/2024', status: 'PENDENTE', tipo: 'NOVO' },
    { id: '2', planta: 'Boldo', usuario: 'Maria Santos', data: '20/01/2024', status: 'APROVADO', tipo: 'EDIÇÃO' },
    { id: '3', planta: 'Pitangueira', usuario: 'Carlos Oliveira', data: '25/01/2024', status: 'REJEITADO', tipo: 'NOVO' },
    { id: '4', planta: 'Aroeira', usuario: 'Ana Costa', data: '28/01/2024', status: 'PENDENTE', tipo: 'EDIÇÃO' },
  ];

  const filteredRegistros = registros.filter((registro) => {
    const matchesSearch = registro.planta.toLowerCase().includes(search.toLowerCase()) ||
                         registro.usuario.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || registro.status === statusFilter;
    const matchesTipo = tipoFilter === 'TODOS' || registro.tipo === tipoFilter;
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Chip label="Pendente" color="warning" size="small" />;
      case 'APROVADO':
        return <Chip label="Aprovado" color="success" size="small" />;
      case 'REJEITADO':
        return <Chip label="Rejeitado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getTipoChip = (tipo: string) => {
    switch (tipo) {
      case 'NOVO':
        return <Chip label="Novo" color="primary" variant="outlined" size="small" />;
      case 'EDIÇÃO':
        return <Chip label="Edição" color="secondary" variant="outlined" size="small" />;
      default:
        return <Chip label={tipo} variant="outlined" size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Moderação
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterListIcon />
          <Typography variant="h6">Filtros</Typography>
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Buscar planta ou usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="PENDENTE">Pendente</MenuItem>
            <MenuItem value="APROVADO">Aprovado</MenuItem>
            <MenuItem value="REJEITADO">Rejeitado</MenuItem>
          </TextField>

          <TextField
            select
            label="Tipo"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="NOVO">Novo</MenuItem>
            <MenuItem value="EDIÇÃO">Edição</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Estatísticas */}
      <GridContainer spacing={2} mb={3}>
        <GridItem xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">4</Typography>
            <Typography variant="body2" color="text.secondary">Total</Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'warning.main' }}>
            <Typography variant="h6">2</Typography>
            <Typography variant="body2" color="text.secondary">Pendentes</Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">1</Typography>
            <Typography variant="body2" color="text.secondary">Aprovados</Typography>
          </Paper>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">1</Typography>
            <Typography variant="body2" color="text.secondary">Rejeitados</Typography>
          </Paper>
        </GridItem>
      </GridContainer>

      {/* Tabela */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Planta</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistros
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((registro) => (
                  <TableRow key={registro.id} hover>
                    <TableCell>{registro.planta}</TableCell>
                    <TableCell>{registro.usuario}</TableCell>
                    <TableCell>{registro.data}</TableCell>
                    <TableCell>{getTipoChip(registro.tipo)}</TableCell>
                    <TableCell>{getStatusChip(registro.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" title="Visualizar">
                        <VisibilityIcon />
                      </IconButton>
                      {registro.status === 'PENDENTE' && (
                        <>
                          <IconButton size="small" color="success" title="Aprovar">
                            <CheckIcon />
                          </IconButton>
                          <IconButton size="small" color="error" title="Rejeitar">
                            <CloseIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRegistros.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Registros por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Ações em lote */}
      {filteredRegistros.filter(r => r.status === 'PENDENTE').length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ações em Lote
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" color="success" startIcon={<CheckIcon />}>
              Aprovar Selecionados
            </Button>
            <Button variant="contained" color="error" startIcon={<CloseIcon />}>
              Rejeitar Selecionados
            </Button>
            <Button variant="outlined">
              Selecionar Todos
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Moderacao;