import { ConsultRoomDTO } from '../types';
import { apiRequest } from './api';

export const consultRoomService = {
  async getAll(): Promise<ConsultRoomDTO[]> {
    return await apiRequest<ConsultRoomDTO[]>({
      url: '/consult-rooms',
      method: 'GET',
    });
  },
  
  async getById(id: number): Promise<ConsultRoomDTO> {
    return await apiRequest<ConsultRoomDTO>({
      url: `/consult-rooms/${id}`,
      method: 'GET',
    });
  },
  
  async create(data: ConsultRoomDTO): Promise<ConsultRoomDTO> {
    return await apiRequest<ConsultRoomDTO>({
      url: '/consult-rooms',
      method: 'POST',
      data,
    });
  },
  
  async update(id: number, data: ConsultRoomDTO): Promise<ConsultRoomDTO> {
    return await apiRequest<ConsultRoomDTO>({
      url: `/consult-rooms/${id}`,
      method: 'PUT',
      data,
    });
  },
  
  async delete(id: number): Promise<void> {
    await apiRequest({
      url: `/consult-rooms/${id}`,
      method: 'DELETE',
    });
  }
};

export default consultRoomService;