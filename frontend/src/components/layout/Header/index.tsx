import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  Badge,
  CircularProgress,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Map as MapIcon,
  Spa as PlantIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, loading } = useAuth()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogin = () => {
    // MOCK DATA
    navigate('/perfil')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    handleClose()
  }

  // lidar com loading screen
  if (loading) {
    return (
      <AppBar position="sticky">
        <Toolbar>
          <CircularProgress size={24} sx={{ color: 'white' }} />
        </Toolbar>
      </AppBar>
    )
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar>
        {/* logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PlantIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              É de Comer?
            </Typography>
          </Box>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {/* navigation Links - desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={<MapIcon />}
            onClick={() => navigate('/mapa')}
            sx={{ textTransform: 'none' }}
          >
            Mapa
          </Button>
          <Button
            startIcon={<PlantIcon />}
            onClick={() => navigate('/plantas')}
            sx={{ textTransform: 'none' }}
          >
            Plantas
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/registrar')}
            sx={{ textTransform: 'none', ml: 1 }}
          >
            Registrar
          </Button>
        </Box>

        {/* user menu */}
        {isAuthenticated ? (
          <>
            <IconButton sx={{ ml: 2 }} onClick={() => navigate('/notificacoes')}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                {user?.nome?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => navigate('/perfil')}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {user?.nome?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {user?.nome}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => navigate('/minhas-plantas')}>
                Minhas Plantas
              </MenuItem>
              <MenuItem onClick={() => navigate('/configuracoes')}>
                Configurações
              </MenuItem>
              {user?.perfil === 'MODERADOR' && (
                <MenuItem onClick={() => navigate('/moderacao')}>
                  Moderação
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                Sair
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={handleLogin}
            sx={{ ml: 2, textTransform: 'none' }}
          >
            Entrar
          </Button>
        )}

        {/* mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <MenuItem onClick={() => navigate('/mapa')}>
          <MapIcon sx={{ mr: 2 }} /> Mapa
        </MenuItem>
        <MenuItem onClick={() => navigate('/plantas')}>
          <PlantIcon sx={{ mr: 2 }} /> Plantas
        </MenuItem>
        <MenuItem onClick={() => navigate('/registrar')}>
          <AddIcon sx={{ mr: 2 }} /> Registrar Planta
        </MenuItem>
        {isAuthenticated && (
          <MenuItem onClick={() => navigate('/perfil')}>
            <PersonIcon sx={{ mr: 2 }} /> Perfil
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  )
}

export default Header