import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // API
      switch (error.response.status) {
        case 401:
          // TOKEN
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acesso negado:', error.response.data);
          break;
        case 404:
          console.error('Recurso não encontrado:', error.config.url);
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro na requisição:', error.message);
      }
    } else if (error.request) {
      // NETWORK
      console.error('Erro de rede. Verifique sua conexão.');
    } else {
      // REQUEST
      console.error('Erro na configuração:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const initialToken = localStorage.getItem('token');
if (initialToken) {
  setAuthToken(initialToken);
}

export default apiClient;