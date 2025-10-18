import axios from 'axios';

// API base URL - update this to your backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface ServiceProvider {
  id: string;
  providerName: string;
  providerType: string;
  servicesProvided: string;
  specialization: string;
  address: string;
  city: string;
  province: string;
  phoneNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  q?: string;
  province?: string;
  city?: string;
  specialization?: string;
  providerType?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  data: ServiceProvider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  provinces: string[];
  cities: string[];
  specializations: string[];
  providerTypes: string[];
}

export interface Statistics {
  total: number;
  byProvince: Array<{ province: string; count: number }>;
  bySpecialization: Array<{ specialization: string; count: number }>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: {
      id: number;
      name: string;
    };
  };
}

// API functions
export const providerApi = {
  // Public endpoints
  search: (params: SearchParams) =>
    api.get<SearchResponse>('/providers/search', { params }),

  getById: (id: string) =>
    api.get<ServiceProvider>(`/providers/${id}`),

  getFilters: () =>
    api.get<FilterOptions>('/providers/filters'),

  getStatistics: () =>
    api.get<Statistics>('/providers/statistics'),

  // Admin endpoints
  create: (data: Omit<ServiceProvider, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<{ message: string; data: ServiceProvider }>('/admin/providers', data),

  update: (id: string, data: Partial<ServiceProvider>) =>
    api.put<{ message: string; data: ServiceProvider }>(`/admin/providers/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/admin/providers/${id}`),

  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ message: string; imported: number; failed: number; total: number }>(
      '/admin/providers/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  clearAll: () =>
    api.delete<{ message: string }>('/admin/providers/clear'),
};

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/email/login', data),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

