import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth endpoints
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
};

// Equipment endpoints
export const equipmentAPI = {
  getAll: (params?: any) => api.get('/equipment', { params }),
  getById: (id: number) => api.get(`/equipment/${id}`),
  create: (data: any) => api.post('/equipment', data),
  update: (id: number, data: any) => api.put(`/equipment/${id}`, data),
  delete: (id: number) => api.delete(`/equipment/${id}`),
};

// Teams endpoints
export const teamsAPI = {
  getAll: () => api.get('/teams'),
  getById: (id: number) => api.get(`/teams/${id}`),
  create: (data: any) => api.post('/teams', data),
  update: (id: number, data: any) => api.put(`/teams/${id}`, data),
  addMember: (id: number, data: any) => api.post(`/teams/${id}/members`, data),
  removeMember: (id: number, userId: number) =>
    api.delete(`/teams/${id}/members/${userId}`),
  getTechnicians: (id: number) => api.get(`/teams/${id}/technicians`),
};

// Requests endpoints
export const requestsAPI = {
  getAll: (params?: any) => api.get('/requests', { params }),
  getById: (id: number) => api.get(`/requests/${id}`),
  create: (data: any) => api.post('/requests', data),
  update: (id: number, data: any) => api.put(`/requests/${id}`, data),
  delete: (id: number) => api.delete(`/requests/${id}`),
  addComment: (id: number, comment: string) =>
    api.post(`/requests/${id}/comments`, { comment }),
  getCalendar: (params?: any) => api.get('/requests/calendar', { params }),
  getDashboardStats: () => api.get('/requests/dashboard/stats'),
};
