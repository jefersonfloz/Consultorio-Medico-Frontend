import { LoginRequest, SignupRequest, AuthResponse } from '../types';
import { apiRequest } from './api';
import { setToken } from '../utils/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiRequest<AuthResponse>({
      url: '/auth/signin',
      method: 'POST',
      data,
    });

    if (response.token) {
      setToken(response.token); 
    }

    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Error personalizado para mostrar al usuario
      throw new Error(error.response.data.error || "Usuario o contraseña incorrectos");
    }

    // Otros errores (por ejemplo, error del servidor, conexión, etc.)
    throw new Error("Error al iniciar sesión. Intenta nuevamente.");
  }
},


  async register(data: SignupRequest): Promise<AuthResponse> {
    return await apiRequest<AuthResponse>({
      url: '/auth/signup',
      method: 'POST',
      data,
    });
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
