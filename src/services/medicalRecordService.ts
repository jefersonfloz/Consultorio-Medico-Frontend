import { MedicalRecordDTO } from '../types';
import { apiRequest } from './api';

export const medicalRecordService = {
  async getAll(): Promise<MedicalRecordDTO[]> {
    return await apiRequest<MedicalRecordDTO[]>({
      url: '/records',
      method: 'GET',
    });
  },
  
  async getById(id: number): Promise<MedicalRecordDTO> {
    return await apiRequest<MedicalRecordDTO>({
      url: `/records/${id}`,
      method: 'GET',
    });
  },
  
  async getByPatientId(patientId: number): Promise<MedicalRecordDTO[]> {
    return await apiRequest<MedicalRecordDTO[]>({
      url: `/records/patient/${patientId}`,
      method: 'GET',
    });
  },
  
  async create(data: MedicalRecordDTO): Promise<MedicalRecordDTO> {
    return await apiRequest<MedicalRecordDTO>({
      url: '/records',
      method: 'POST',
      data,
    });
  },
  
  async update(id: number, data: MedicalRecordDTO): Promise<MedicalRecordDTO> {
    return await apiRequest<MedicalRecordDTO>({
      url: `/records/${id}`,
      method: 'PUT',
      data,
    });
  },
  
  async delete(id: number): Promise<void> {
    await apiRequest({
      url: `/records/${id}`,
      method: 'DELETE',
    });
  }
};

export default medicalRecordService;