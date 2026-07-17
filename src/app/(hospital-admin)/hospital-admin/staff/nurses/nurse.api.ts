import apiClient from '@/src/lib/api-client';

export interface Nurse {
  nurse_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  department: string;
  ward: string;
  qualification: string | null;
  experience_years: number;
  phone: string;
}

export interface CreateNursePayload {
  name: string;
  email: string;
  password: string;
  department: string;
  ward: string;
  qualification?: string;
  experience_years?: number;
  phone: string;
}

export const nursesApi = {
  async findAll() {
    const { data } = await apiClient.get('/nurses');
    return data as Nurse[];
  },
  async create(payload: CreateNursePayload) {
    const { data } = await apiClient.post('/nurses', payload);
    return data as { nurse_id: string; user_id: string; email: string; name: string };
  },
};