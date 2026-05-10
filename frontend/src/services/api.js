import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const solicitacoesService = {
  criar: (data) => api.post('/solicitacoes', data),
  listar: () => api.get('/solicitacoes'),
  listarTodas: () => api.get('/solicitacoes/admin'),
  buscar: (id) => api.get(`/solicitacoes/${id}`),
};

export const agendamentosService = {
  agendar: (data) => api.post('/agendamentos', data),
  atualizarStatus: (solicitacaoId, status) =>
    api.patch(`/agendamentos/${solicitacaoId}/status`, { status }),
};

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  registro: (email, senha) => api.post('/auth/registro', { email, senha }),
};

export default api;
