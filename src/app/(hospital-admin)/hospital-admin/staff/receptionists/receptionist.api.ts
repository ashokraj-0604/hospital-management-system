import apiClient from '@/src/lib/api-client';

export interface Receptionist {
  receptionist_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  desk_assignment: string;
  shift: 'MORNING' | 'EVENING' | 'NIGHT';
  phone: string;
}

export interface CreateReceptionistPayload {
  name: string; email: string; password: string;
  desk_assignment: string; shift: 'MORNING' | 'EVENING' | 'NIGHT'; phone: string;
}

export const receptionistsApi = {
  async findAll() {
    const { data } = await apiClient.get('/receptionists');
    return data as Receptionist[];
  },
  async create(payload: CreateReceptionistPayload) {
    const { data } = await apiClient.post('/receptionists', payload);
    return data;
  },
};