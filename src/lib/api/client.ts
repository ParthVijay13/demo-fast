// Centralized API client using Axios with typed helpers
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseUrl?: string;
  getAuthToken?: () => string | undefined;
}

const defaultConfig: Required<ApiClientConfig> = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/v1',
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || undefined;
    }
    return undefined;
  },
};

let activeConfig: Required<ApiClientConfig> = { ...defaultConfig };

export const configureApiClient = (config: ApiClientConfig) => {
  activeConfig = { ...defaultConfig, ...config };
  // Update axios instance with new config
  axiosInstance.defaults.baseURL = activeConfig.baseUrl;
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: activeConfig.baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = activeConfig.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message || 
                   'Request failed';
    throw new Error(message);
  }
);

export const apiClient = {
  get: async <T>(path: string, options?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(path, options);
    return response.data;
  },
  
  post: async <T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(path, body, options);
    return response.data;
  },
  
  put: async <T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<T>(path, body, options);
    return response.data;
  },
  
  patch: async <T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.patch<T>(path, body, options);
    return response.data;
  },
  
  delete: async <T>(path: string, options?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(path, options);
    return response.data;
  },
};

// Export axios instance for direct use if needed
export { axiosInstance };


