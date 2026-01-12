import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from '../Header';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <p>© É Comestível? © {new Date().getFullYear()} by <a href="https://github.com/evicacoelho">Emanuelle Coelho</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt=""/><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt=""/><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt=""/><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt=""/></p>
            <p>Projeto de conscientização sobre flora urbana</p>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;