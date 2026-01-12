import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../types';

// estado inicial
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// MOCK DATA
const mockUser: User = {
  id: '1',
  nome: 'Usuário Teste',
  email: 'teste@email.com',
  perfil: 'USUARIO',
  dataCadastro: new Date().toISOString(),
  reputacao: 100,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // login
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },

    // registro
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // atualizar usuário
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // verificar token
    checkAuthStart: (state) => {
      state.loading = true;
    },
    checkAuthSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    checkAuthFailure: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('token');
    },

    // erro
    clearError: (state) => {
      state.error = null;
    },

    // MOCK DATA
    mockLogin: (state) => {
      state.user = mockUser;
      state.token = 'mock-token-12345';
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('token', 'mock-token-12345');
    },
  },
});

// actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  updateUser,
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,
  clearError,
  mockLogin,
} = authSlice.actions;

// reducer
export default authSlice.reducer;