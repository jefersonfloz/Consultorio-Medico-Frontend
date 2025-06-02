import { PatientDTO } from '../types';
import { apiRequest } from './api';

export const patientService = {
  async getAll(): Promise<PatientDTO[]> {
    return await apiRequest<PatientDTO[]>({
      url: '/patients',
      method: 'GET',
    });
  },
  
  async getById(id: number): Promise<PatientDTO> {
    return await apiRequest<PatientDTO>({
      url: `/patients/${id}`,
      method: 'GET',
    });
  },
  
  async create(data: PatientDTO): Promise<PatientDTO> {
    return await apiRequest<PatientDTO>({
      url: '/patients',
      method: 'POST',
      data,
    });
  },
  
  async update(id: number, data: PatientDTO): Promise<PatientDTO> {
    return await apiRequest<PatientDTO>({
      url: `/patients/${id}`,
      method: 'PUT',
      data,
    });
  },
  
  async delete(id: number): Promise<void> {
    await apiRequest({
      url: `/patients/${id}`,
      method: 'DELETE',
    });
  }
};

export default patientService;