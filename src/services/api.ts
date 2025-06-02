import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiError } from '../types';
import { getToken, removeToken } from '../utils/auth';

// Crear instancia de axios
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud para añadir el token (excepto rutas públicas)
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Rutas públicas donde no se debe enviar el token
    const publicPaths = ['/auth/signup', '/auth/signin'];
    const isPublic = publicPaths.some((path) =>
      config.url?.includes(path)
    );

    if (token && !isPublic) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const err = error as AxiosError<ApiError>;

    // Si el token es inválido o expiró
    if (err.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);



// Función genérica para hacer peticiones
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw {
      message: err.response?.data?.message || 'Ocurrió un error',
      errors: err.response?.data?.errors,
      status: err.response?.status
    } as ApiError;
  }
};

export default api;

