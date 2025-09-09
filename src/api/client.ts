import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Products API
type ProductFilters = {
  search?: string;
  category?: string;
  sort?: 'latest' | 'price_low' | 'price_high';
  brand?: string;
};

export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  getOne: (id: number) => apiClient.get(`/categories/${id}`),
  create: (data: any) => apiClient.post('/categories', data),
  update: (id: number, data: any) => apiClient.put(`/categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/categories/${id}`),
};

export const productsApi = {
  getAll: (page = 1, filters?: ProductFilters) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.brand) params.append('brand', filters.brand);
    }

    return apiClient.get(`/products?${params.toString()}`);
  },
  getOne: (id: number) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: number, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
};

// Repair Orders API
export const repairsApi = {
  getAll: () => apiClient.get('/repairs'),
  getOne: (id) => apiClient.get(`/repairs/${id}`),
  create: (data) => apiClient.post('/repairs', data),
  updateStatus: (id, status) => apiClient.patch(`/repairs/${id}/status`, { status }),
  getServices: () => apiClient.get('/repairs/services'),
  track: (code) => apiClient.get(`/repairs/track/${code}`),
};

// Trade API
export const tradesApi = {
  getAll: () => apiClient.get('/trades'),
  create: (data) => apiClient.post('/trades', data),
  updateStatus: (id, status) => apiClient.patch(`/trades/${id}/status`, { status }),
  cancel: (id) => apiClient.post(`/trades/${id}/cancel`),
};

// Auth API
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getUser: () => apiClient.get('/auth/user'),
};

export default apiClient;
