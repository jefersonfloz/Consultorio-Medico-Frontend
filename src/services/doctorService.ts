import { DoctorDTO } from '../types';
import { apiRequest } from './api';

export const doctorService = {
  async getAll(): Promise<DoctorDTO[]> {
    return await apiRequest<DoctorDTO[]>({
      url: '/doctors',
      method: 'GET',
    });
  },
  
  async getById(id: number): Promise<DoctorDTO> {
    return await apiRequest<DoctorDTO>({
      url: `/doctors/${id}`,
      method: 'GET',
    });
  },
  
  async getBySpecialty(specialty: string): Promise<DoctorDTO[]> {
    return await apiRequest<DoctorDTO[]>({
      url: `/doctors/${specialty}`,
      method: 'GET',
    });
  },
  
  async create(data: DoctorDTO): Promise<DoctorDTO> {
    return await apiRequest<DoctorDTO>({
      url: '/doctors',
      method: 'POST',
      data,
    });
  },
  
  async update(id: number, data: DoctorDTO): Promise<DoctorDTO> {
    return await apiRequest<DoctorDTO>({
      url: `/doctors/${id}`,
      method: 'PUT',
      data,
    });
  },
  
  async delete(id: number): Promise<void> {
    await apiRequest({
      url: `/doctors/${id}`,
      method: 'DELETE',
    });
  }
};

export default doctorService;