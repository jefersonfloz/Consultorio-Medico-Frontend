import { AppointmentDTO } from '../types';
import { apiRequest } from './api';

export const appointmentService = {
  async getAll(): Promise<AppointmentDTO[]> {
    return await apiRequest<AppointmentDTO[]>({
      url: '/appointments',
      method: 'GET',
    });
  },
  
  async getById(id: number): Promise<AppointmentDTO> {
    return await apiRequest<AppointmentDTO>({
      url: `/appointments/${id}`,
      method: 'GET',
    });
  },
  
  async create(data: AppointmentDTO): Promise<AppointmentDTO> {
    return await apiRequest<AppointmentDTO>({
      url: '/appointments',
      method: 'POST',
      data,
    });
  },
  
  async update(id: number, data: AppointmentDTO): Promise<AppointmentDTO> {
    return await apiRequest<AppointmentDTO>({
      url: `/appointments/${id}`,
      method: 'PUT',
      data,
    });
  },
  
  async delete(id: number): Promise<void> {
    await apiRequest({
      url: `/appointments/${id}`,
      method: 'DELETE',
    });
  }
};

export default appointmentService;