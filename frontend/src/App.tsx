import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Plantas from './pages/Plantas'
import PlantaDetalhes from './pages/PlantaDetalhes'
import RegistrarPlanta from './pages/RegistrarPlanta'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Perfil from './pages/Perfil'
import MinhasPlantas from './pages/MinhasPlantas'
import Moderacao from './pages/Moderacao'
import NotFound from './pages/NotFound'

// criação do tema a partir do material ui
const theme = createTheme({
  palette: {
    primary: {
      main: '#22c55e',
    },
    secondary: {
      main: '#3b82f6',
    },
    background: {
      default: '#f9fafb',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
})

// react query
const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="mapa" element={<MapPage />} />
                <Route path="plantas" element={<Plantas />} />
                <Route path="plantas/:id" element={<PlantaDetalhes />} />
                <Route path="registrar" element={<RegistrarPlanta />} />
                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Cadastro />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="minhas-plantas" element={<MinhasPlantas />} />
                <Route path="moderacao" element={<Moderacao />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App